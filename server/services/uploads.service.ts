import path from 'path';
import { Upload } from '../../common/models/upload.model';
import fs from 'fs';
import { UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2/promise';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';

const pageSize: number = 20;

export const getUploadsData = async (page: number): Promise<PaginatedApiResponse<Upload>> => {
  if (page < 1) throw new Error('Die Seitennummer muss größer oder gleich 1 sein.');

  // SQL-Abfrage mit LIMIT und OFFSET
  const offset = (page - 1) * pageSize;
  const readQuery = `SELECT uploadID, odtFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt, pdfFileDownloadedByUser, odtFileDownloadedByUser 
                       FROM uploads 
                       ORDER BY uploadDate DESC 
                       LIMIT ${pageSize} OFFSET ${offset}`;

  // Hole die Daten für die aktuelle Seite
  const [rows] = await db.execute<RowDataPacket[]>(readQuery);

  // Mapping der Ergebnisse zu Upload-Objekten
  const items: Upload[] = rows.map(row => {
    const upload = new Upload(row['uploadID']);
    upload.odtFile = Boolean(row['odtFile']);
    upload.pdfFile = Boolean(row['pdfFile']);
    upload.filesDeleted = Boolean(row['filesDeleted']);
    upload.uploadDate = new Date(row['uploadDate']);
    upload.antragsart = row['antragsart'];
    upload.grundbuchamt = row['grundbuchamt'];
    upload.pdfFileDownloadedByUser = row['pdfFileDownloadedByUser'] === null ? undefined : !!row['pdfFileDownloadedByUser'];
    upload.odtFileDownloadedByUser = row['odtFileDownloadedByUser'] === null ? undefined : !!row['odtFileDownloadedByUser'];
    return upload;
  });

  // Gesamtanzahl der Dateien berechnen
  const countQuery = `SELECT COUNT(*) AS totalFiles FROM uploads`;
  const [countResult] = await db.execute<RowDataPacket[]>(countQuery);
  const totalItems = countResult[0]['totalFiles'] as number;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    totalPages,
    totalItems,
    items
  };
};

export const readUpload = async (UploadID: string): Promise<Upload> => {
  const readQuery = `SELECT uploadID, odtFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt, pdfFileDownloadedByUser, odtFileDownloadedByUser
                       FROM uploads WHERE uploadID = ?`;
  const [result] = await db.execute<RowDataPacket[]>(readQuery, [UploadID]);
  const row = result[0];

  const upload = new Upload(row['uploadID']);

  upload.odtFile = Boolean(row['odtFile']);
  upload.pdfFile = Boolean(row['pdfFile']);
  upload.filesDeleted = Boolean(row['filesDeleted']);
  upload.uploadDate = new Date(row['uploadDate']);
  upload.antragsart = row['antragsart'];
  upload.grundbuchamt = row['grundbuchamt'];
  upload.pdfFileDownloadedByUser = row['pdfFileDownloadedByUser'] === null ? undefined : !!row['pdfFileDownloadedByUser'];
  upload.odtFileDownloadedByUser = row['odtFileDownloadedByUser'] === null ? undefined : !!row['odtFileDownloadedByUser'];
  return upload;
};

export const updateUploadData = async (data: Upload): Promise<void> => {
  const checkQuery = `SELECT 1 FROM uploads WHERE uploadID = ?`;
  const [result] = await db.execute<RowDataPacket[]>(checkQuery, [data.uploadID]);
  const exists = result.length > 0;

  const sql = exists
    ? `UPDATE uploads 
           SET odtFile = ?, pdfFile = ?, filesDeleted = ?, uploadDate = ?, antragsart = ?, grundbuchamt = ?, pdfFileDownloadedByUser = ?, odtFileDownloadedByUser = ?
           WHERE uploadID = ?`
    : `INSERT INTO uploads (uploadID, odtFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt, pdfFileDownloadedByUser, odtFileDownloadedByUser)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = exists
    ? [
        data.odtFile,
        data.pdfFile,
        data.filesDeleted,
        data.uploadDate,
        data.antragsart,
        data.grundbuchamt,
        data.pdfFileDownloadedByUser ?? null,
        data.odtFileDownloadedByUser ?? null,
        data.uploadID
      ]
    : [
        data.uploadID,
        data.odtFile,
        data.pdfFile,
        data.filesDeleted,
        data.uploadDate,
        data.antragsart,
        data.grundbuchamt,
        data.pdfFileDownloadedByUser ?? null,
        data.odtFileDownloadedByUser ?? null
      ];

  await db.execute(sql, params);
};

export const deleteUpload = async (uploadID: string[]): Promise<void> => {
  if (uploadID.length === 0) throw new Error('Keine UploadIDs übergeben');
  for (const id of uploadID) {
    await deleteGeneratedFiles(id);
  }
  const placeholders = uploadID.map(() => '?').join(', ');
  const deleteQuery = `DELETE FROM uploads WHERE uploadID IN (${placeholders})`;
  await db.execute<RowDataPacket[]>(deleteQuery, uploadID);
};

export const deleteAllUploads = async (): Promise<void> => {
  const deleteQuery = `DELETE FROM uploads`;
  await Promise.all([db.execute(deleteQuery), fs.promises.rm(UPLOADS_FOLDER_PATH, { recursive: true, force: true })]);
};

export const deleteGeneratedFiles = async (uploadID: string): Promise<void> => {
  const folderPath = path.join(UPLOADS_FOLDER_PATH, uploadID);
  await fs.promises.rm(folderPath, { recursive: true, force: true });
  const upload: Upload = await readUpload(uploadID);
  upload.filesDeleted = true;
  await updateUploadData(upload);
};

export const deleteAllGeneratedFiles = async (): Promise<void> => {
  const selectQuery = `SELECT uploadID FROM uploads WHERE filesDeleted = 0`;
  const [result] = await db.execute<RowDataPacket[]>(selectQuery);

  for (const id of result) {
    await deleteGeneratedFiles(id['uploadID']);
  }
};

export const getUploadDates = async (timeframe: 'week' | 'month'): Promise<Date[]> => {
  const timeCondition = timeframe === 'week' ? 'uploadDate >= NOW() - INTERVAL 7 DAY' : 'uploadDate >= NOW() - INTERVAL 1 MONTH';

  const sql = `
        SELECT uploadDate
        FROM uploads
        WHERE ${timeCondition}
    `;

  const [results] = await db.execute<RowDataPacket[]>(sql);
  const dates = results.map(row => row['uploadDate'] as Date);
  return dates;
};

export const getUploadCountPerDays = async (timeframe: 'week' | 'month'): Promise<{ date: Date; count: number }[]> => {
  const datesArray: Date[] = await getUploadDates(timeframe);

  const startDate =
    timeframe === 'week' ? new Date(new Date().setDate(new Date().getDate() - 6)) : new Date(new Date().setMonth(new Date().getMonth() - 1));

  startDate.setHours(0, 0, 0, 0);

  const allDaysInTimeframe: { date: Date; count: number }[] = [];
  const todayString = new Date().toLocaleDateString('us-US', { timeZone: 'Europe/Berlin' });
  const today = new Date(todayString);

  // Iteriere über den Zeitraum und füge alle Tage hinzu
  for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
    allDaysInTimeframe.push({ date: new Date(date), count: 0 });
  }

  for (const date of datesArray) {
    const dateFromTimeframe = allDaysInTimeframe.find(
      day => day.date.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }) === date.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })
    );
    if (dateFromTimeframe) {
      dateFromTimeframe.count++;
    }
  }

  return allDaysInTimeframe;
};

export const reportDownloadByUser = async (uploadID: string, fileType: 'odtFile' | 'pdfFile'): Promise<void> => {
  const updateQuery = `UPDATE uploads SET ${fileType}DownloadedByUser = 1 WHERE uploadID = ?`;
  await db.execute(updateQuery, [uploadID]);
};
