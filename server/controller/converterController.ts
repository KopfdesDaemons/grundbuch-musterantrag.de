import { spawn } from 'child_process';

export const convertToPdf = async (filepath: string, folderpath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const args = ['--convert-to', 'pdf', filepath, '--outdir', folderpath];
        const child = spawn('soffice', args);

        child.on('error', (err) => {
            reject(err);
        });

        child.on('exit', (code, signal) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Fehler beim Konvertieren: Exit-Code ${code}, Signal ${signal}`));
            }
        });
    });
};
