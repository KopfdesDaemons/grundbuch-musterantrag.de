import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import path, { dirname, join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import loggerMiddleware from './server/middleware/loggerMiddleware';
import authMiddleware from './server/middleware/authMiddleware';
import * as directoryController from './server/controller/directoryController';
import * as authController from './server/controller/authController';
import * as scrapingController from './server/controller/scrapingController';
import * as loggerController from './server/controller/loggerController';
import submitForm from './server/routes/submitForm'
import { Logger } from 'winston';
import fileUpload from 'express-fileupload';
import * as fs from 'fs';

declare global {
  namespace Express {
    interface Request {
      logger: Logger
    }
  }
}

const SERVER_DIST_FOLDER = dirname(fileURLToPath(import.meta.url));
const UPLOADS_FOLDER_PATH: string = path.join(SERVER_DIST_FOLDER, '/uploads')

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const browserDistFolder = resolve(SERVER_DIST_FOLDER, '../browser');
  const indexHtml = join(SERVER_DIST_FOLDER, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
    redirect: false
  }));

  // Überprüfe, ob der Uploads Ordner existiert und erstelle ihn bei Bedarf
  if (!fs.existsSync(UPLOADS_FOLDER_PATH)) {
    fs.mkdirSync(UPLOADS_FOLDER_PATH, { recursive: true });
  }

  // Middlewares für die gesamte App
  server.use(fileUpload());
  server.use(express.json());
  server.use(loggerMiddleware);

  // Routen, welche nur einen Controller ansprechen
  server.post('/api/login', authController.login);
  server.post('/api/init', authController.createHashFile);
  server.get('/api/uploads', authMiddleware, (req, res) => directoryController.getFileList(req, res, UPLOADS_FOLDER_PATH));
  server.delete('/api/uploads/deleteFiles', authMiddleware, (req, res) => {
    const fileName = req.query['fileName'] as string;
    if (!fileName) res.status(400).send('Fehlender Dateiname');
    const folderPath = path.join(UPLOADS_FOLDER_PATH, fileName);
    directoryController.deleteFolder(req, res, folderPath);
  });
  server.delete('/api/uploads', authMiddleware, (req, res) => directoryController.deleteFolderContent(req, res, UPLOADS_FOLDER_PATH));
  server.get('/api/uploads/getFile', authMiddleware, (req, res) => {
    const fileNameWithExtension: string = req.query['fileName'] as string;

    if (!fileNameWithExtension) {
      res.status(400).send('Fehlender Dateiname');
      return;
    }

    const fileWithoutExtension: string = fileNameWithExtension.split('.')[0];
    const folderPath: string = path.join(UPLOADS_FOLDER_PATH, fileWithoutExtension);

    directoryController.getFile(req, res, folderPath, fileNameWithExtension);

  });
  server.get('/api/amtsgerichtausplz', scrapingController.amtsgerichtausplz);
  server.delete('/api/deleteLogFile', authMiddleware, loggerController.deleteLogFile);
  server.get('/api/getLogFile', authMiddleware, loggerController.getLogFile);

  // ausgelagerte Routen
  server.use('/', submitForm);

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
