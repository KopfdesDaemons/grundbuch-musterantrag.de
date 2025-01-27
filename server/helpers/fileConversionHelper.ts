import { spawn } from 'child_process';

export const convertToPdf = async (docxFilePath: string, outputFolderPath: string): Promise<void> => {
    const args = ['--headless', '--convert-to', 'pdf', docxFilePath, '--outdir', outputFolderPath];

    const child = spawn('soffice', args);

    // Die Funktion wartet auf den Abschluss des Prozesses und gibt ein Ergebnis zurück.
    const promise = new Promise<void>((resolve, reject) => {
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

    await promise;
};
