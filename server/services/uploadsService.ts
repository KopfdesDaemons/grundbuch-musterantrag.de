import path from 'path';
import { Upload } from '../models/upload';
import { checkFileExists } from './directoryService';
import fs from 'fs';
import { UPLOADS_FOLDER_PATH } from 'server/config/config';

const pageSize = 20;

export const getUploadsData = async (folderPath: string, page: number): Promise<any> => {
    if (!fs.existsSync(folderPath)) {
        throw new Error('Ordner nicht existent');
    }

    // Lade alle Ordner
    const folders = await fs.promises.readdir(folderPath, { withFileTypes: true });
    const list: Upload[] = [];

    for (const folder of folders) {
        if (folder.isDirectory()) {
            const uploadID = folder.name;
            const uploadinfoPath = path.join(folderPath, uploadID, uploadID + '.json');
            if (! await checkFileExists(uploadinfoPath)) continue;
            const upload: Upload = await readUploadJSON(uploadID);
            if (!upload.uploadID) upload.uploadID = uploadID;
            list.push(upload);
        }
    }

    // Sortiere die Liste nach der UploadID absteigend
    list.sort((a, b) => {
        return b.uploadID.localeCompare(a.uploadID);
    })

    // Paginierung anwenden
    const startIndex = (page - 1) * pageSize;
    const paginatedList = list.slice(startIndex, startIndex + pageSize);

    // Festlegen der Gesamtzahl der Dateien und Gesamtzahl der Seiten
    const totalFiles = list.length;
    const totalPages = Math.ceil(totalFiles / pageSize);

    return {
        page,
        totalPages,
        totalFiles,
        files: paginatedList
    };
};

export const readUploadJSON = async (UploadID: string): Promise<Upload> => {
    const pathToJSON = path.join(UPLOADS_FOLDER_PATH, UploadID, UploadID + '.json');
    const file = await fs.promises.readFile(pathToJSON, 'utf8');
    const data: Upload = JSON.parse(file) as Upload;
    return data;
};

export const writeUploadJSON = async (data: Upload): Promise<void> => {
    const pathToJSON = path.join(UPLOADS_FOLDER_PATH, data.uploadID, data.uploadID + '.json');
    await fs.promises.writeFile(pathToJSON, JSON.stringify(data, null, 2));
};

export const deleteGeneratedFiles = async (uploadID: string): Promise<void> => {
    const pathToPdf = path.join(UPLOADS_FOLDER_PATH, uploadID, uploadID + '.pdf');
    const pathToDocx = path.join(UPLOADS_FOLDER_PATH, uploadID, uploadID + '.docx');
    if (await checkFileExists(pathToPdf)) await fs.promises.unlink(pathToPdf);
    if (await checkFileExists(pathToDocx)) await fs.promises.unlink(pathToDocx);

    const upload: Upload = await readUploadJSON(uploadID);
    upload.filesDeleted = true;
    await writeUploadJSON(upload);
}

export const deleteAllGeneratedFiles = async (): Promise<void> => {
    const uploadsFolders = await fs.promises.readdir(UPLOADS_FOLDER_PATH);

    for (const folder of uploadsFolders) {
        await deleteGeneratedFiles(folder);
    }
}