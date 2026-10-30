import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { randomUUID } from 'crypto';
import logger from 'server/config/logger.config';

// Unique named pipe, temporary profile directory, and Python worker script path for the current process's LibreOffice daemon
const PIPE_NAME = `lo_uno_daemon_${process.pid}`;
const DAEMON_PROFILE_DIR = path.join(os.tmpdir(), `lo_daemon_profile_${process.pid}`);
const PYTHON_UNO_WORKER_PATH = path.join(process.cwd(), 'server', 'helpers', 'uno-worker.py');

// Represents an in-flight PDF conversion request awaiting completion from the Python worker
interface PendingRequest {
  resolve: () => void;
  // eslint-disable-next-line no-unused-vars
  reject: (err: Error) => void;
}

// Persistent state stored on globalThis to survive Vite SSR hot-reloads in development
interface UnoDaemonState {
  sofficeDaemon: ChildProcess | null;
  pythonWorker: ChildProcess | null;
  daemonInitPromise: Promise<void> | null;
  daemonReady: boolean;
  requestCounter: number;
  pendingRequests: Map<number, PendingRequest>;
  exitHandlerRegistered: boolean;
}

const GLOBAL_STATE_KEY = Symbol.for('grundbuch.unoDaemonState');
const globalWithState = globalThis as typeof globalThis & { [GLOBAL_STATE_KEY]?: UnoDaemonState };

const state: UnoDaemonState = (globalWithState[GLOBAL_STATE_KEY] ??= {
  sofficeDaemon: null,
  pythonWorker: null,
  daemonInitPromise: null,
  daemonReady: false,
  requestCounter: 0,
  pendingRequests: new Map<number, PendingRequest>(),
  exitHandlerRegistered: false
});

// Builds the environment variables required for running LibreOffice and the UNO Python bridge headlessly
const getLibreOfficeEnv = (): typeof process.env => ({
  ...process.env,
  SAL_USE_VCLPLUGIN: 'svp',
  OOP_DISABLE_RECOVERY: '1',
  HOME: os.tmpdir(),
  PYTHONPATH: [process.env['PYTHONPATH'], '/usr/lib/libreoffice/program', '/usr/lib64/libreoffice/program'].filter(Boolean).join(':'),
  URE_BOOTSTRAP: process.env['URE_BOOTSTRAP'] || 'vnd.sun.star.pathname:/usr/lib/libreoffice/program/fundamentalrc'
});

// Terminates the worker and daemon processes and rejects all pending conversion requests
const cleanupDaemon = () => {
  state.daemonReady = false;
  state.daemonInitPromise = null;

  if (state.pythonWorker) {
    state.pythonWorker.removeAllListeners();
    state.pythonWorker.kill();
    state.pythonWorker = null;
  }
  if (state.sofficeDaemon) {
    state.sofficeDaemon.removeAllListeners();
    state.sofficeDaemon.kill();
    state.sofficeDaemon = null;
  }

  // Reject any pending conversion requests since the daemon has stopped
  for (const [, req] of state.pendingRequests) {
    req.reject(new Error('LibreOffice-Daemon wurde unerwartet beendet.'));
  }
  state.pendingRequests.clear();
};

// Ensure child processes and temporary profile files are cleaned up when the Node.js process exits
if (!state.exitHandlerRegistered) {
  state.exitHandlerRegistered = true;
  process.on('exit', () => {
    cleanupDaemon();
    try {
      fs.rmSync(DAEMON_PROFILE_DIR, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors on exit
    }
  });
}

// Initializes the persistent LibreOffice daemon and Python UNO worker if not already running
export const initPdfConverter = (): Promise<void> => {
  // Return immediately if the daemon and worker are already initialized and ready
  if (
    state.daemonReady &&
    state.pythonWorker &&
    state.pythonWorker.exitCode === null &&
    state.sofficeDaemon &&
    state.sofficeDaemon.exitCode === null
  ) {
    return Promise.resolve();
  }
  // Return the existing initialization promise if startup is already in progress
  if (state.daemonInitPromise) {
    return state.daemonInitPromise;
  }

  state.daemonInitPromise = new Promise<void>((resolve, reject) => {
    const env = getLibreOfficeEnv();

    // Start LibreOffice in headless listening mode using a named pipe
    const soffice = spawn(
      'soffice',
      [
        `-env:UserInstallation=file://${DAEMON_PROFILE_DIR}`,
        '--headless',
        '--invisible',
        '--nodefault',
        '--nofirststartwizard',
        '--nolockcheck',
        '--nologo',
        '--norestore',
        `--accept=pipe,name=${PIPE_NAME};urp;StarOffice.ComponentContext`
      ],
      { env, stdio: 'ignore' }
    );
    state.sofficeDaemon = soffice;

    soffice.on('error', err => {
      cleanupDaemon();
      reject(err);
    });

    soffice.on('exit', () => {
      if (state.daemonReady) {
        logger.warn('LibreOffice-Daemon wurde beendet und wird beim nächsten Request neu gestartet.');
      }
      cleanupDaemon();
    });

    // Spawn the Python UNO worker process to communicate with the LibreOffice daemon
    const worker = spawn('python3', ['-u', PYTHON_UNO_WORKER_PATH, PIPE_NAME], {
      env,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    state.pythonWorker = worker;

    // Collect standard error output from the Python worker for error reporting
    let stderr = '';
    worker.stderr?.on('data', data => {
      stderr += data.toString();
    });

    // Listen for readiness and conversion results from the Python worker via stdout
    const rl = readline.createInterface({ input: worker.stdout });
    rl.on('line', line => {
      // Mark the daemon as ready once the warmup sequence finishes
      if (line === 'READY') {
        state.daemonReady = true;
        logger.info('Persistenter LibreOffice-UNO-Daemon ist bereit.');
        resolve();
        return;
      }

      // Parse JSON response and resolve or reject the corresponding pending request
      try {
        const msg = JSON.parse(line) as { id: number; ok: boolean; error?: string };
        const pending = state.pendingRequests.get(msg.id);
        if (pending) {
          state.pendingRequests.delete(msg.id);
          if (msg.ok) {
            pending.resolve();
          } else {
            pending.reject(new Error(msg.error || 'Unbekannter UNO-Konvertierungsfehler'));
          }
        }
      } catch {
        // Ignore non-JSON stdout lines
      }
    });

    worker.on('error', err => {
      cleanupDaemon();
      reject(err);
    });

    worker.on('exit', (code, signal) => {
      if (!state.daemonReady) {
        cleanupDaemon();
        reject(new Error(`Python-UNO-Worker konnte nicht gestartet werden (Code ${code}, Signal ${signal}): ${stderr}`));
      } else {
        cleanupDaemon();
      }
    });
  });

  return state.daemonInitPromise;
};

// Fallback method that spawns a one-off LibreOffice CLI process to convert a document to PDF
const convertViaFallbackCli = async (filePath: string, outputFolderPath: string): Promise<void> => {
  // Use an isolated temporary user profile to allow concurrent CLI executions
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

  const child = spawn('soffice', args, { env: getLibreOfficeEnv() });

  let stdout = '';
  let stderr = '';

  child.stdout?.on('data', data => {
    stdout += data.toString();
  });

  child.stderr?.on('data', data => {
    stderr += data.toString();
  });

  try {
    // Wait for the CLI conversion process to finish
    await new Promise<void>((resolve, reject) => {
      child.on('error', err => reject(err));
      child.on('exit', (code, signal) => {
        if (code === 0) resolve();
        else reject(new Error(`Exit-Code ${code}, Signal ${signal}\nStderr: ${stderr}\nStdout: ${stdout}`));
      });
    });
  } finally {
    // Clean up the temporary user profile directory after conversion
    await fs.promises.rm(profileDir, { recursive: true, force: true }).catch(() => undefined);
  }
};

// Converts the specified document to a PDF file in the given output folder
export const convertToPdf = async (filePath: string, outputFolderPath: string): Promise<void> => {
  const parsedPath = path.parse(filePath);
  const outputPdfPath = path.join(outputFolderPath, `${parsedPath.name}.pdf`);

  try {
    // Ensure the persistent UNO daemon is initialized and ready
    await initPdfConverter();
    if (!state.pythonWorker?.stdin) {
      throw new Error('UNO-Worker stdin nicht verfügbar.');
    }

    // Send the conversion job to the Python worker and await its completion
    const id = ++state.requestCounter;
    await new Promise<void>((resolve, reject) => {
      state.pendingRequests.set(id, { resolve, reject });
      state.pythonWorker!.stdin!.write(JSON.stringify({ id, input: filePath, output: outputPdfPath }) + '\n', err => {
        if (err) {
          state.pendingRequests.delete(id);
          reject(err);
        }
      });
    });
  } catch (err) {
    // Fall back to a standalone LibreOffice CLI process if the daemon conversion fails
    logger.warn('UNO-Daemon-Konvertierung fehlgeschlagen, nutze CLI-Fallback:', err);
    await convertViaFallbackCli(filePath, outputFolderPath);
  }
};
