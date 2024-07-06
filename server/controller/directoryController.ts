import { log } from 'console';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const pageSize = 20;
const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));

export const getDocxAndPdfFiles = async (req: Request, res: Response, folderPath: string): Promise<void> => {
    try {

        if (!fs.existsSync(folderPath)) res.status(500).send('Ordner nicht existent');

        const page = parseInt(req.query['page'] as string, 10) || 1;
        const offset = (page - 1) * pageSize;

        const files = await fs.promises.readdir(folderPath);

        const fileStats = await Promise.all(files.map(async (file) => {
            const filePath = path.join(folderPath, file);
            const stats = await fs.promises.stat(filePath);
            return { file, stats };
        }));

        // Sortiere: Neuste Datei zuerst
        const sortedFiles = fileStats.sort((a, b) => b.stats.mtimeMs - a.stats.mtimeMs).map(({ file }) => file);

        // Festlegen der Gesamtzahl der Dateien und Gesamtzahl der Seiten
        const totalFiles = sortedFiles.length;
        const totalPages = Math.ceil(totalFiles / pageSize);

        // Festlegen der Dateien für die aktuelle Seite
        const pageFiles = sortedFiles.slice(offset, offset + pageSize);

        let mergedFileInfo: { name: string; docxFile: string; pdfFile: string; uploadDate: string; }[] = [];

        for (const file of pageFiles) {
            const name = file.split('.').slice(0, -1).join('.'); // Entferne Dateiendung
            const filePath = path.join(folderPath, file);
            const fileStats = await fs.promises.stat(filePath);
            const uploadDate = fileStats.birthtime;
            const day = uploadDate.getDate().toString().padStart(2, '0');
            const month = (uploadDate.getMonth() + 1).toString().padStart(2, '0');
            const year = uploadDate.getFullYear().toString();

            const formattedDate = `${day}.${month}.${year}`;

            if (!mergedFileInfo.some((fileInfo) => fileInfo.name === name)) {
                const fileInfo = {
                    name,
                    docxFile: '',
                    pdfFile: '',
                    uploadDate: formattedDate,
                };

                const docxFile = name + '.docx';
                const pdfFile = name + '.pdf';
                const pathDocx = path.join(folderPath, docxFile);
                const pathPdf = path.join(folderPath, pdfFile);

                if (await checkFileExists(pathDocx)) fileInfo.docxFile = docxFile;
                if (await checkFileExists(pathPdf)) fileInfo.pdfFile = pdfFile;

                mergedFileInfo.push(fileInfo);
            }
        }

        const response = {
            page,
            totalPages,
            totalFiles,
            files: mergedFileInfo
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

export const deleteDocxAndPdfFiles = async (req: Request, res: Response, folderPath: string): Promise<void> => {
    try {
        const name = req.query['name'] as string;

        // Prüfen, ob die Docx- und PDF-Dateien vorhanden sind und lösche sie
        if (await checkFileExists(path.join(folderPath, `${name}.docx`))) {
            await fs.promises.unlink(path.join(folderPath, `${name}.docx`));
        }
        if (await checkFileExists(path.join(folderPath, `${name}.pdf`))) {
            await fs.promises.unlink(path.join(folderPath, `${name}.pdf`));
        }

        res.send({ message: `Die Docx- und PDF-Dateien für '${name}' wurden erfolgreich gelöscht.` });
    } catch (error) {
        req.logger.error('Fehler beim Löschen der Docx- und PDF-Dateien', error);
        res.status(500).send({ error: 'Fehler beim Löschen der Docx- und PDF-Dateien' });
    }
};

export const getFile = (req: Request, res: Response, filePath: string): void => {
    const fileName = filePath.replace(/^.*[\\\/]/, '');

    fs.readFile(filePath, (error, data) => {
        if (error) {
            req.logger.error('Fehler beim Lesen einer Datei.', error);
            res.status(500).send('Datei konnte nicht gelesen werden.');
            return;
        }

        const ext = path.extname(filePath);

        if (ext === '.pdf') {
            res.contentType('application/pdf');
            res.setHeader('Content-Disposition', 'inline');
            res.setHeader('title', 'Musterantrag');
        } else {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        }
        res.send(data);
    });
};

export const deleteAllFilesInFolder = async (req: Request, res: Response, folderPath: string): Promise<void> => {
    try {
        const files = await fs.promises.readdir(folderPath);

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            await fs.promises.unlink(filePath);
        }

        res.status(200).send('Alle Dateien gelöscht');
    } catch (error) {
        req.logger.error('Fehler beim Löschen der Dateien aus dem Ordner.', error);
        res.status(500).send('Fehler beim Löschen der Dateien');
    }
};

export const deleteLogFile = async (req: Request, res: Response) => {
    try {
        await fs.promises.writeFile(path.join(SERVER_DIST_FOLDER, 'logFile.log'), '');
        res.status(200).send('LogFile.log gelöscht.');
    } catch (error: any) {
        req.logger.error('Fehler beim Löschen der LogFile.log', error);
        res.status(500).send('Fehler beim Löschen der LogFile.log: ' + error.message);
    }
};

export const getLogFile = async (req: Request, res: Response) => {
    try {
        const logFilePath = path.join(SERVER_DIST_FOLDER, 'logFile.log');
        const data = await fs.promises.readFile(logFilePath, 'utf8');

        if (data === '') {
            return res.status(200).send('Keine Serverlogs');
        }

        // Trenne die JSON-Zeilen und füge sie zu einem Array zusammen
        const logs = data.trim().split('\n').map(line => JSON.parse(line));

        return res.status(200).json(logs.reverse());
    } catch (error: any) {
        req.logger.error('Fehler beim Lesen der LogFile.log', error);
        return res.status(500).send('Fehler beim Lesen der LogFile.log: ' + error.message);
    }
};
