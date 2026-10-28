import path from 'path';
import { Upload, UploadSectionTime } from '../../common/models/upload.model';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { UPLOADS_FOLDER_PATH } from 'server/config/path.config';
import { db } from './database.service';
import { RowDataPacket } from 'mysql2/promise';
import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';

const pageSize: number = 20;

export const getUploadsData = async (page: number): Promise<PaginatedApiResponse<Upload>> => {
  if (page < 1) throw new Error('Die Seitennummer muss größer oder gleich 1 sein.');

  const offset = (page - 1) * pageSize;
  const readQuery = `SELECT uploadID, odtFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt, pdfFileDownloadedByUser, odtFileDownloadedByUser, finished, rating
                       FROM uploads
                       WHERE finished = 1
                       ORDER BY uploadDate DESC
                       LIMIT ${pageSize} OFFSET ${offset}`;

  const [rows] = await db.execute<RowDataPacket[]>(readQuery);

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
    upload.finished = Boolean(row['finished']);
    upload.rating = row['rating'] !== null && row['rating'] !== undefined ? Number(row['rating']) : null;
    return upload;
  });

  if (items.length > 0) {
    const placeholders = items.map(() => '?').join(', ');
    const sectionQuery = `
      SELECT uploadID, section, stepOrder, loadedAt, completedAt, durationMs
      FROM upload_section_times
      WHERE uploadID IN (${placeholders})
      ORDER BY stepOrder ASC, sectionTimeID ASC
    `;
    const [sectionRows] = await db.execute<RowDataPacket[]>(
      sectionQuery,
      items.map(item => item.uploadID)
    );

    const sectionsByUpload = new Map<string, UploadSectionTime[]>();
    for (const row of sectionRows) {
      const id = row['uploadID'] as string;
      const list = sectionsByUpload.get(id) ?? [];
      list.push({
        section: row['section'] as string,
        stepOrder: Number(row['stepOrder'] || 0),
        loadedAt: row['loadedAt'] ? new Date(row['loadedAt']) : null,
        completedAt: row['completedAt'] ? new Date(row['completedAt']) : null,
        durationMs: Number(row['durationMs'] || 0)
      });
      sectionsByUpload.set(id, list);
    }

    for (const item of items) {
      const sectionTimes = sectionsByUpload.get(item.uploadID) ?? [];
      item.sectionTimes = sectionTimes;
      item.totalDurationMs = sectionTimes.reduce((sum, s) => sum + s.durationMs, 0);
    }
  }

  // Gesamtanzahl der abgeschlossenen Anträge berechnen
  const countQuery = `SELECT COUNT(*) AS totalFiles FROM uploads WHERE finished = 1`;
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
  const readQuery = `SELECT uploadID, odtFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt, pdfFileDownloadedByUser, odtFileDownloadedByUser, finished, rating
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
  upload.finished = Boolean(row['finished']);
  upload.rating = row['rating'] !== null && row['rating'] !== undefined ? Number(row['rating']) : null;
  return upload;
};

export const updateUploadData = async (data: Upload): Promise<void> => {
  const upsertQuery = `
    INSERT INTO uploads (
      uploadID, odtFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt, pdfFileDownloadedByUser, odtFileDownloadedByUser, finished, rating
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      odtFile = VALUES(odtFile),
      pdfFile = VALUES(pdfFile),
      filesDeleted = VALUES(filesDeleted),
      uploadDate = VALUES(uploadDate),
      antragsart = VALUES(antragsart),
      grundbuchamt = VALUES(grundbuchamt),
      pdfFileDownloadedByUser = COALESCE(VALUES(pdfFileDownloadedByUser), pdfFileDownloadedByUser),
      odtFileDownloadedByUser = COALESCE(VALUES(odtFileDownloadedByUser), odtFileDownloadedByUser),
      finished = VALUES(finished),
      rating = COALESCE(VALUES(rating), rating)
  `;

  await db.execute(upsertQuery, [
    data.uploadID,
    data.odtFile,
    data.pdfFile,
    data.filesDeleted,
    data.uploadDate,
    data.antragsart,
    data.grundbuchamt,
    data.pdfFileDownloadedByUser ?? null,
    data.odtFileDownloadedByUser ?? null,
    data.finished,
    data.rating ?? null
  ]);
};

export const loadFormSection = async (
  uploadID: string | undefined,
  antragsart: string,
  section: string,
  stepOrder: number = 0
): Promise<string> => {
  const now = new Date();
  let activeUploadID = uploadID;

  if (!activeUploadID) {
    activeUploadID = randomUUID();
    const insertUploadQuery = `
      INSERT INTO uploads (
        uploadID, odtFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt, finished
      ) VALUES (?, FALSE, FALSE, FALSE, ?, ?, '', FALSE)
    `;
    await db.execute(insertUploadQuery, [activeUploadID, now, antragsart]);
  } else {
    const [existing] = await db.execute<RowDataPacket[]>(`SELECT uploadID FROM uploads WHERE uploadID = ?`, [activeUploadID]);
    if (existing.length === 0) {
      const insertUploadQuery = `
        INSERT INTO uploads (
          uploadID, odtFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt, finished
        ) VALUES (?, FALSE, FALSE, FALSE, ?, ?, '', FALSE)
      `;
      await db.execute(insertUploadQuery, [activeUploadID, now, antragsart]);
    }
  }

  const upsertSectionQuery = `
    INSERT INTO upload_section_times (uploadID, section, stepOrder, loadedAt, completedAt, durationMs)
    VALUES (?, ?, ?, ?, NULL, 0)
    ON DUPLICATE KEY UPDATE
      loadedAt = VALUES(loadedAt),
      completedAt = NULL
  `;
  await db.execute(upsertSectionQuery, [activeUploadID, section, stepOrder, now]);

  return activeUploadID;
};

export const completeFormSection = async (uploadID: string, section: string): Promise<void> => {
  const now = new Date();
  const [rows] = await db.execute<RowDataPacket[]>(
    `SELECT loadedAt, completedAt, durationMs FROM upload_section_times WHERE uploadID = ? AND section = ?`,
    [uploadID, section]
  );

  if (rows.length === 0) return;

  const row = rows[0];
  if (!row['loadedAt'] || row['completedAt'] !== null) {
    return;
  }

  const loadedAt = new Date(row['loadedAt']);
  const elapsedMs = Math.max(0, now.getTime() - loadedAt.getTime());
  const newDurationMs = Number(row['durationMs'] || 0) + elapsedMs;

  await db.execute(`UPDATE upload_section_times SET completedAt = ?, durationMs = ? WHERE uploadID = ? AND section = ?`, [
    now,
    newDurationMs,
    uploadID,
    section
  ]);
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
  const selectQuery = `SELECT uploadID FROM uploads WHERE filesDeleted = 0 AND finished = 1`;
  const [result] = await db.execute<RowDataPacket[]>(selectQuery);

  for (const id of result) {
    await deleteGeneratedFiles(id['uploadID']);
  }
};

export const reportDownloadByUser = async (uploadID: string, fileType: 'odtFile' | 'pdfFile'): Promise<void> => {
  const updateQuery = `UPDATE uploads SET ${fileType}DownloadedByUser = 1 WHERE uploadID = ?`;
  await db.execute(updateQuery, [uploadID]);
};
