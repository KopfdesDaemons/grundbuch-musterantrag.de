import { spawn } from 'child_process';

export const convertToPdf = async (filePath: string, outputFolderPath: string): Promise<void> => {
  const args = ['--headless', '--convert-to', 'pdf', filePath, '--outdir', outputFolderPath];

  const child = spawn('soffice', args);

  let stdout = '';
  let stderr = '';

  child.stdout?.on('data', data => {
    stdout += data.toString();
  });

  child.stderr?.on('data', data => {
    stderr += data.toString();
  });

  const promise = new Promise<void>((resolve, reject) => {
    child.on('error', err => {
      reject(err);
    });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Exit-Code ${code}, Signal ${signal}\nStderr: ${stderr}\nStdout: ${stdout}`));
      }
    });
  });

  await promise;
};
