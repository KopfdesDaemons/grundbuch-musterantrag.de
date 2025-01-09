import path from 'path';
import { Upload } from '../models/upload';
import { checkFileExists } from './directoryService';
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
    const checkQuery = `SELECT * FROM uploads WHERE uploadID = ?`;
    const existingUpload: any = await query(checkQuery, [data.uploadID]);

    if (existingUpload && existingUpload.length > 0) {
        // Datensatz existiert, also UPDATE ausführen
        const updateQuery = `
                UPDATE uploads 
                SET docxFile = ?, pdfFile = ?, filesDeleted = ?, uploadDate = ?, antragsart = ?, grundbuchamt = ?
                WHERE uploadID = ?
            `;
        await query(updateQuery, [
            data.docxFile,
            data.pdfFile,
            data.filesDeleted,
            data.uploadDate,
            data.antragsart,
            data.grundbuchamt,
            data.uploadID
        ]);
    } else {
        // Datensatz existiert nicht, also INSERT ausführen
        const insertQuery = `
                INSERT INTO uploads (uploadID, docxFile, pdfFile, filesDeleted, uploadDate, antragsart, grundbuchamt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
        await query(insertQuery, [
            data.uploadID,
            data.docxFile,
            data.pdfFile,
            data.filesDeleted,
            data.uploadDate,
            data.antragsart,
            data.grundbuchamt
        ]);
    }
};

export const deleteUpload = async (uploadID: string): Promise<void> => {
    const deleteQuery = `DELETE FROM uploads WHERE uploadID = ?`;
    await query(deleteQuery, [uploadID]);
}

export const deleteAllUploads = async (): Promise<void> => {
    const deleteQuery = `DELETE FROM uploads`;
    await query(deleteQuery, []);
}

export const deleteGeneratedFiles = async (uploadID: string): Promise<void> => {
    const pathToPdf = path.join(UPLOADS_FOLDER_PATH, uploadID, uploadID + '.pdf');
    const pathToDocx = path.join(UPLOADS_FOLDER_PATH, uploadID, uploadID + '.docx');
    if (await checkFileExists(pathToPdf)) await fs.promises.unlink(pathToPdf);
    if (await checkFileExists(pathToDocx)) await fs.promises.unlink(pathToDocx);

    const upload: Upload = await readUpload(uploadID);
    upload.filesDeleted = true;

    await updateUploadData(upload);
}

export const deleteAllGeneratedFiles = async (): Promise<void> => {
    const uploadsFolders = await fs.promises.readdir(UPLOADS_FOLDER_PATH);

    for (const folder of uploadsFolders) {
        await deleteGeneratedFiles(folder);
    }
}