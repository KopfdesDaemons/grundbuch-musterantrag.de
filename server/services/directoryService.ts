import * as fs from 'fs';
import * as path from 'path';


export const checkFileExists = async (filePath: string): Promise<boolean> => {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
};

export const deleteFolder = async (folderPath: string): Promise<void> => {
    await fs.promises.rm(folderPath, { recursive: true });
};

export const deleteFolderContent = async (folderPath: string): Promise<void> => {
    await deleteContentRecursive(folderPath);

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
    }
};

export const getFile = async (folderPath: string, fileName: string): Promise<Buffer> => {
    const filePath = path.join(folderPath, fileName);

    if (!await checkFileExists(filePath)) {
        throw new Error('Datei nicht gefunden');
    }

    return fs.promises.readFile(filePath);
};
