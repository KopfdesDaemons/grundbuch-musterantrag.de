import { spawn } from 'child_process';
import * as fs from 'fs';
import os from 'os';
import path from 'path';
import { randomUUID } from 'crypto';

export const convertToPdf = async (filePath: string, outputFolderPath: string): Promise<void> => {
  const profileDir = path.join(os.tmpdir(), `lo_profile_${randomUUID()}`);
  const args = [
    `-env:UserInstallation=file://${profileDir}`,
    '--headless',
    '--invisible',
    '--nodefault',
    '--nofirststartwizard',
    '--nolockcheck',
    '--nologo',
    '--norestore',
    '--convert-to',
    'pdf',
    filePath,
    '--outdir',
    outputFolderPath
  ];

  const child = spawn('soffice', args);

  let stdout = '';
  let stderr = '';

  child.stdout?.on('data', data => {
    stdout += data.toString();
  });

  child.stderr?.on('data', data => {
    stderr += data.toString();
  });

  try {
    await new Promise<void>((resolve, reject) => {
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
  } finally {
    await fs.promises.rm(profileDir, { recursive: true, force: true }).catch(() => undefined);
  }
};
