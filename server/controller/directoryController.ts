import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { AntragsData } from 'server/models/antragsData';

const pageSize = 20;

export const getFileList = async (req: Request, res: Response, folderPath: string): Promise<void> => {
    try {
        if (!fs.existsSync(folderPath)) {
            res.status(500).send('Ordner nicht existent');
            return;
        }

        // Lade alle Ordner
        const folders = await fs.promises.readdir(folderPath, { withFileTypes: true });

        const list: AntragsData[] = [];

        for (const folder of folders) {
            if (folder.isDirectory()) {
                const antragsName = folder.name;
                const antragsData: AntragsData = new AntragsData();
                antragsData.fileName = antragsName;

                // Prüfe ob .docx und .pdf Dateien vorhanden sind
                const pathToDocx = path.join(folderPath, folder.name, antragsName + '.docx');
                const pathToPdf = path.join(folderPath, folder.name, antragsName + '.pdf');
                if (await checkFileExists(pathToDocx)) antragsData.docxFile = true;
                if (await checkFileExists(pathToPdf)) antragsData.pdfFile = true;

                const pathToJSON = path.join(folderPath, folder.name, antragsName + '.json');
                if (await checkFileExists(pathToJSON)) {
                    const file = await fs.promises.readFile(pathToJSON, 'utf8');
                    const data = JSON.parse(file);
                    antragsData.antragsart = data.title;
                }

                // Lese Erstellungsdatum
                if (antragsData.docxFile) {
                    const fileStats = await fs.promises.stat(pathToDocx);
                    const uploadDate = fileStats.birthtime;
                    const day = uploadDate.getDate().toString().padStart(2, '0');
                    const month = (uploadDate.getMonth() + 1).toString().padStart(2, '0');
                    const year = uploadDate.getFullYear().toString();

                    const formattedDate = `${day}.${month}.${year}`;
                    antragsData.uploadDate = formattedDate;
                }

                list.push(antragsData);
            }
        }

        // Sortiere die Liste nach dem Dateinamen aufsteigend
        list.sort((a, b) => {
            return b.fileName.localeCompare(a.fileName);
        });

        // Paginierung anwenden
        const page = parseInt(req.query['page'] as string, 10) || 1;
        const startIndex = (page - 1) * pageSize;
        const paginatedList = list.slice(startIndex, startIndex + pageSize);


        // Festlegen der Gesamtzahl der Dateien und Gesamtzahl der Seiten
        const totalFiles = folders.length;
        const totalPages = Math.ceil(totalFiles / pageSize);

        const response = {
            page,
            totalPages,
            totalFiles,
            files: paginatedList
        };

        res.send(response);
    } catch (error) {
        req.logger.error('Fehler beim Laden der Dateien aus dem Ordner', error);
        res.status(500).send('Interner Serverfehler');
    }
};

export const checkFileExists = async (filePath: string): Promise<boolean> => {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
};

export const deleteFolder = async (req: Request, res: Response, folderPath: string): Promise<void> => {
    try {
        await fs.promises.rm(folderPath, { recursive: true });
        res.status(200).send('Ordner gelöscht');
    } catch (error) {
        req.logger.error('Fehler beim Löschen des Ordners', error);
        res.status(500).send('Serverfehler beim Löschen des Ordners');
    }
};

export const getFile = async (req: Request, res: Response, folderPath: string, fileName: string): Promise<void> => {
    const filePath = path.join(folderPath, fileName);

    try {
        // Überprüfen, ob die Datei existiert
        if (!await checkFileExists(filePath)) {
            req.logger.error('Datei nicht gefunden:', fileName);
            res.status(404).send('Datei nicht gefunden');
            return
        }

        // Datei herunterladen
        res.download(filePath, fileName, (err) => {
            if (err) {
                req.logger.error('Fehler beim Download der Datei', err);

                if (!res.headersSent) {
                    res.status(500).send('Fehler beim Download der Datei');
                } else {
                    res.end();
                }
            }
        });
    } catch (err) {
        req.logger.error('Unerwarteter Fehler beim Download der Datei', err);

        if (!res.headersSent) {
            res.status(500).send('Unerwarteter Fehler beim Download der Datei');
        }
    }
};


export const deleteFolderContent = async (req: Request, res: Response, folderPath: string): Promise<void> => {
    try {
        await deleteContentRecursive(folderPath);
        res.status(200).send('Alle Dateien und Unterordner gelöscht');
    } catch (error) {
        req.logger.error('Fehler beim Löschen der Dateien und Ordner.', error);
        res.status(500).send('Fehler beim Löschen der Dateien und Ordner');
    }

    async function deleteContentRecursive(folderPath: string): Promise<void> {
        const files = await fs.promises.readdir(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileStat = await fs.promises.stat(filePath);

            if (fileStat.isDirectory()) {
                // Rekursive Löschung für Unterordner
                await deleteContentRecursive(filePath);
                await fs.promises.rmdir(filePath);
            } else {
                // Datei löschen
                await fs.promises.unlink(filePath);
            }
        }
    };
};
