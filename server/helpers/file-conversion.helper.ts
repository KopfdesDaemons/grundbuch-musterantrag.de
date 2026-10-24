import { ChildProcess, spawn } from 'child_process';
import * as fs from 'fs';
import os from 'os';
import path from 'path';
import readline from 'readline';
import { randomUUID } from 'crypto';
import logger from 'server/config/logger.config';

const PIPE_NAME = `lo_uno_daemon_${process.pid}`;
const DAEMON_PROFILE_DIR = path.join(os.tmpdir(), `lo_daemon_profile_${process.pid}`);

const PYTHON_UNO_WORKER_SCRIPT = `
import sys, os, time, json

# Ensure LibreOffice program dir is in PYTHONPATH (needed on Alpine/Linux)
for p in ('/usr/lib/libreoffice/program', '/usr/lib64/libreoffice/program'):
    if os.path.isdir(p) and p not in sys.path:
        sys.path.append(p)

import uno
from com.sun.star.beans import PropertyValue

pipe_name = sys.argv[1]
local_ctx = uno.getComponentContext()
resolver = local_ctx.ServiceManager.createInstanceWithContext(
    "com.sun.star.bridge.UnoUrlResolver", local_ctx
)

ctx = None
for _ in range(100):
    try:
        ctx = resolver.resolve(f"uno:pipe,name={pipe_name};urp;StarOffice.ComponentContext")
        break
    except Exception:
        time.sleep(0.05)

if ctx is None:
    sys.stderr.write("Failed to connect to LibreOffice UNO pipe\\n")
    sys.exit(1)

smgr = ctx.ServiceManager
desktop = smgr.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)

def make_prop(name, val):
    p = PropertyValue()
    p.Name = name
    p.Value = val
    return p

load_props = (make_prop("Hidden", True), make_prop("ReadOnly", True), make_prop("UpdateDocMode", 0))
store_props = (make_prop("FilterName", "writer_pdf_Export"),)

# Warmup Writer & PDF export filter libraries in memory before marking READY
try:
    warmup_pdf = os.path.join("/tmp", f"lo_warmup_{os.getpid()}.pdf")
    wdoc = desktop.loadComponentFromURL("private:factory/swriter", "_blank", 0, (make_prop("Hidden", True),))
    if wdoc is not None:
        wdoc.storeToURL(uno.systemPathToFileUrl(warmup_pdf), store_props)
        wdoc.close(True)
    if os.path.exists(warmup_pdf):
        os.remove(warmup_pdf)
except Exception:
    pass

sys.stdout.write("READY\\n")
sys.stdout.flush()

for line in sys.stdin:
    line = line.strip()
    if not line:
        continue
    req = json.loads(line)
    req_id = req.get("id")
    try:
        in_url = uno.systemPathToFileUrl(os.path.abspath(req["input"]))
        out_url = uno.systemPathToFileUrl(os.path.abspath(req["output"]))
        doc = desktop.loadComponentFromURL(in_url, "_blank", 0, load_props)
        if doc is None:
            raise RuntimeError("loadComponentFromURL returned None")
        try:
            doc.storeToURL(out_url, store_props)
        finally:
            doc.close(True)
        sys.stdout.write(json.dumps({"id": req_id, "ok": True}) + "\\n")
    except Exception as e:
        sys.stdout.write(json.dumps({"id": req_id, "ok": False, "error": str(e)}) + "\\n")
    sys.stdout.flush()
`;

interface PendingRequest {
  resolve: () => void;
  reject: (err: Error) => void;
}

let sofficeDaemon: ChildProcess | null = null;
let pythonWorker: ChildProcess | null = null;
let daemonInitPromise: Promise<void> | null = null;
let daemonReady = false;
let requestCounter = 0;
const pendingRequests = new Map<number, PendingRequest>();

const getLibreOfficeEnv = (): NodeJS.ProcessEnv => ({
  ...process.env,
  SAL_USE_VCLPLUGIN: 'svp',
  OOP_DISABLE_RECOVERY: '1',
  HOME: os.tmpdir(),
  PYTHONPATH: [process.env['PYTHONPATH'], '/usr/lib/libreoffice/program', '/usr/lib64/libreoffice/program']
    .filter(Boolean)
    .join(':'),
  URE_BOOTSTRAP:
    process.env['URE_BOOTSTRAP'] || 'vnd.sun.star.pathname:/usr/lib/libreoffice/program/fundamentalrc'
});

const cleanupDaemon = () => {
  daemonReady = false;
  daemonInitPromise = null;

  if (pythonWorker) {
    pythonWorker.kill();
    pythonWorker = null;
  }
  if (sofficeDaemon) {
    sofficeDaemon.kill();
    sofficeDaemon = null;
  }

  for (const [, req] of pendingRequests) {
    req.reject(new Error('LibreOffice-Daemon wurde unerwartet beendet.'));
  }
  pendingRequests.clear();
};

process.on('exit', () => {
  cleanupDaemon();
  try {
    fs.rmSync(DAEMON_PROFILE_DIR, { recursive: true, force: true });
  } catch {
    // ignore cleanup errors on exit
  }
});

export const initPdfConverter = (): Promise<void> => {
  if (daemonReady && pythonWorker && sofficeDaemon) {
    return Promise.resolve();
  }
  if (daemonInitPromise) {
    return daemonInitPromise;
  }

  daemonInitPromise = new Promise<void>((resolve, reject) => {
    const env = getLibreOfficeEnv();

    sofficeDaemon = spawn(
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

    sofficeDaemon.on('error', err => {
      cleanupDaemon();
      reject(err);
    });

    sofficeDaemon.on('exit', () => {
      if (daemonReady) {
        logger.warn('LibreOffice-Daemon wurde beendet und wird beim nächsten Request neu gestartet.');
      }
      cleanupDaemon();
    });

    pythonWorker = spawn('python3', ['-u', '-c', PYTHON_UNO_WORKER_SCRIPT, PIPE_NAME], {
      env,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stderr = '';
    pythonWorker.stderr?.on('data', data => {
      stderr += data.toString();
    });

    const rl = readline.createInterface({ input: pythonWorker.stdout! });
    rl.on('line', line => {
      if (line === 'READY') {
        daemonReady = true;
        logger.info('Persistenter LibreOffice-UNO-Daemon ist bereit.');
        resolve();
        return;
      }

      try {
        const msg = JSON.parse(line) as { id: number; ok: boolean; error?: string };
        const pending = pendingRequests.get(msg.id);
        if (pending) {
          pendingRequests.delete(msg.id);
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

    pythonWorker.on('error', err => {
      cleanupDaemon();
      reject(err);
    });

    pythonWorker.on('exit', code => {
      if (!daemonReady) {
        cleanupDaemon();
        reject(new Error(`Python-UNO-Worker konnte nicht gestartet werden (Code ${code}): ${stderr}`));
      } else {
        cleanupDaemon();
      }
    });
  });

  return daemonInitPromise;
};

const convertViaFallbackCli = async (filePath: string, outputFolderPath: string): Promise<void> => {
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
    await new Promise<void>((resolve, reject) => {
      child.on('error', err => reject(err));
      child.on('exit', (code, signal) => {
        if (code === 0) resolve();
        else reject(new Error(`Exit-Code ${code}, Signal ${signal}\nStderr: ${stderr}\nStdout: ${stdout}`));
      });
    });
  } finally {
    await fs.promises.rm(profileDir, { recursive: true, force: true }).catch(() => undefined);
  }
};

export const convertToPdf = async (filePath: string, outputFolderPath: string): Promise<void> => {
  const parsedPath = path.parse(filePath);
  const outputPdfPath = path.join(outputFolderPath, `${parsedPath.name}.pdf`);

  try {
    await initPdfConverter();
    if (!pythonWorker?.stdin) {
      throw new Error('UNO-Worker stdin nicht verfügbar.');
    }

    const id = ++requestCounter;
    await new Promise<void>((resolve, reject) => {
      pendingRequests.set(id, { resolve, reject });
      pythonWorker!.stdin!.write(JSON.stringify({ id, input: filePath, output: outputPdfPath }) + '\n', err => {
        if (err) {
          pendingRequests.delete(id);
          reject(err);
        }
      });
    });
  } catch (err) {
    logger.warn('UNO-Daemon-Konvertierung fehlgeschlagen, nutze CLI-Fallback:', err);
    await convertViaFallbackCli(filePath, outputFolderPath);
  }
};
