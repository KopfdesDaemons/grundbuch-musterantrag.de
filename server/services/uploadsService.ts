import path from 'path';
import { Upload } from '../models/upload';
import { checkFileExists } from './directoryService';
import fs from 'fs';
import { Antrag } from 'src/app/interfaces/antrag';

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
            const antragsName = folder.name;
            const upload: Upload = new Upload();
            upload.fileName = antragsName;

            // Prüfe ob .docx und .pdf Dateien vorhanden sind
            const pathToDocx = path.join(folderPath, folder.name, antragsName + '.docx');
            const pathToPdf = path.join(folderPath, folder.name, antragsName + '.pdf');
            if (await checkFileExists(pathToDocx)) upload.docxFile = true;
            if (await checkFileExists(pathToPdf)) upload.pdfFile = true;

            const pathToJSON = path.join(folderPath, folder.name, antragsName + '.json');
            if (await checkFileExists(pathToJSON)) {
                const file = await fs.promises.readFile(pathToJSON, 'utf8');
                const data = JSON.parse(file);
                upload.antragsart = data.title;
            }

            // Lese Erstellungsdatum
            if (upload.docxFile) {
                const fileStats = await fs.promises.stat(pathToDocx);
                const uploadDate = fileStats.birthtime;
                const day = uploadDate.getDate().toString().padStart(2, '0');
                const month = (uploadDate.getMonth() + 1).toString().padStart(2, '0');
                const year = uploadDate.getFullYear().toString();

                const formattedDate = `${day}.${month}.${year}`;
                upload.uploadDate = formattedDate;
            }

            list.push(upload);
        }
    }

    // Sortiere die Liste nach dem Dateinamen aufsteigend
    list.sort((a, b) => {
        return b.fileName.localeCompare(a.fileName);
    });

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

export const readUploadJSON = async (folderPath: string, fileName: string): Promise<Antrag> => {
    const pathToJSON = path.join(folderPath, fileName, fileName + '.json');
    if (await checkFileExists(pathToJSON)) {
        const file = await fs.promises.readFile(pathToJSON, 'utf8');
        const data: Antrag = JSON.parse(file) as Antrag;
        return data;
    }
    throw new Error('Upload JSON nicht gefunden');
};