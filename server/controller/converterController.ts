import { spawn, SpawnOptions } from 'child_process';

export const convertToPdf = async (filepath: string, folderpath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const args = ['--convert-to', 'pdf', filepath, '--outdir', folderpath];
        const options: SpawnOptions = {
            shell: true // Wenn nötig, je nach Betriebssystem
        };
        const child = spawn('soffice', args, options);

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
