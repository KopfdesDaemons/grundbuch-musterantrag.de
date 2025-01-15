import path from 'path';
import { Upload } from '../models/upload';
import fs from 'fs';
import { UPLOADS_FOLDER_PATH } from 'server/config/config';
import { query } from './databaseService';

const pageSize = 20;

export const getUploadsData = async (page: number): Promise<any> => {
    if (page < 1) throw new Error("Die Seitennummer muss größer oder gleich 1 sein.");

    // SQL-Abfrage mit LIMIT und OFFSET
    const offset = (page - 1) * pageSize;
    const readQuery = `SELECT uploadID, docxFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt FROM uploads ORDER BY uploadDate DESC LIMIT ? OFFSET ?`;
    const rows: any = await query(readQuery, [pageSize, offset]);

    const list: Upload[] = rows.map((row: {
        uploadID: string;
        docxFile: any;
        pdfFile: any;
        filesDeleted: any;
        uploadDate: string | number | Date;
        antragsart: string;
        grundbuchamt: string;
    }) => {
        const upload = new Upload(row.uploadID);
        upload.docxFile = Boolean(row.docxFile);
        upload.pdfFile = Boolean(row.pdfFile);
        upload.filesDeleted = Boolean(row.filesDeleted);
        upload.uploadDate = new Date(row.uploadDate);
        upload.antragsart = row.antragsart;
        upload.grundbuchamt = row.grundbuchamt;
        return upload;
    });

    // Gesamtanzahl der Dateien berechnen
    const countQuery = `SELECT COUNT(*) AS totalFiles FROM uploads`;
    const countResult: any = await query(countQuery, []);
    const totalFiles = countResult[0].totalFiles;
    const totalPages = Math.ceil(totalFiles / pageSize);

    return {
        page,
        totalPages,
        totalFiles,
        files: list
    };
};

export const readUpload = async (UploadID: string): Promise<Upload> => {
    const readQuery = `SELECT uploadID, docxFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt FROM uploads WHERE uploadID = ?`;
    const result: any = await query(readQuery, [UploadID]);
    const row = result[0];

    const upload = new Upload(row.uploadID);

    upload.docxFile = Boolean(row.docxFile);
    upload.pdfFile = Boolean(row.pdfFile);
    upload.filesDeleted = Boolean(row.filesDeleted);
    upload.uploadDate = new Date(row.uploadDate);
    upload.antragsart = row.antragsart;
    upload.grundbuchamt = row.grundbuchamt;
    return upload;
};

export const updateUploadData = async (data: Upload): Promise<void> => {
    const checkQuery = `SELECT 1 FROM uploads WHERE uploadID = ?`;
    const exists = (await query<Upload[]>(checkQuery, [data.uploadID])).length > 0;

    const sql = exists
        ? `UPDATE uploads 
           SET docxFile = ?, pdfFile = ?, filesDeleted = ?, uploadDate = ?, antragsart = ?, grundbuchamt = ? 
           WHERE uploadID = ?`
        : `INSERT INTO uploads (uploadID, docxFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = exists
        ? [data.docxFile, data.pdfFile, data.filesDeleted, data.uploadDate, data.antragsart, data.grundbuchamt, data.uploadID]
        : [data.uploadID, data.docxFile, data.pdfFile, data.filesDeleted, data.uploadDate, data.antragsart, data.grundbuchamt];

    await query(sql, params);
};

export const deleteUpload = async (uploadID: string): Promise<void> => {
    await deleteGeneratedFiles(uploadID);
    const deleteQuery = `DELETE FROM uploads WHERE uploadID = ?`;
    await query(deleteQuery, [uploadID]);
}

export const deleteAllUploads = async (): Promise<void> => {
    const deleteQuery = `DELETE FROM uploads`;
    await query(deleteQuery, []);
    await fs.promises.rm(UPLOADS_FOLDER_PATH, { recursive: true, force: true });
}

export const deleteGeneratedFiles = async (uploadID: string): Promise<void> => {
    const folderPath = path.join(UPLOADS_FOLDER_PATH, uploadID);
    await fs.promises.rm(folderPath, { recursive: true, force: true });
    const upload: Upload = await readUpload(uploadID);
    upload.filesDeleted = true;
    await updateUploadData(upload);
}

export const deleteAllGeneratedFiles = async (): Promise<void> => {
    const selectQuery = `SELECT uploadID FROM uploads WHERE filesDeleted = 0`;
    const result: { uploadID: string }[] = await query<{ uploadID: string }[]>(selectQuery, []);

    for (const id of result) {
        await deleteGeneratedFiles(id.uploadID);
    }
}

export const getUploadDates = async (timeframe: 'week' | 'month'): Promise<Date[]> => {
    const timeCondition = timeframe === 'week'
        ? "uploadDate >= NOW() - INTERVAL 7 DAY"
        : "uploadDate >= NOW() - INTERVAL 1 MONTH";

    const sql = `
        SELECT uploadDate
        FROM uploads
        WHERE ${timeCondition}
    `;

    const results = await query<{ uploadDate: Date }[]>(sql, []);
    const dates = results.map(row => row.uploadDate);
    return dates;
};

export const getUploadCountPerDays = async (timeframe: 'week' | 'month'): Promise<{ date: Date; count: number }[]> => {
    const datesArray: Date[] = await getUploadDates(timeframe);

    const startDate = timeframe === 'week'
        ? new Date(new Date().setDate(new Date().getDate() - 6))
        : new Date(new Date().setMonth(new Date().getMonth() - 1));

    startDate.setHours(0, 0, 0, 0);

    const allDaysInTimeframe: { date: Date; count: number }[] = [];
    const todayString = new Date().toLocaleDateString('us-US', { timeZone: 'Europe/Berlin' });
    const today = new Date(todayString);

    // Iteriere über den Zeitraum und füge alle Tage hinzu
    for (let date = new Date(startDate); date <= today; date.setDate(date.getDate() + 1)) {
        allDaysInTimeframe.push({ date: new Date(date), count: 0 });
    }

    for (const date of datesArray) {
        const dateFromTimeframe = allDaysInTimeframe.find(day =>
            day.date.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' }) === date.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin' })
        );
        if (dateFromTimeframe) {
            dateFromTimeframe.count++;
        }
    }

    return allDaysInTimeframe;
};