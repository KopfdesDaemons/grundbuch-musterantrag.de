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
import grundbuchausdruckRoute from './server/routes/anträge/grundbuchausdruckRoute'
import { Logger } from 'winston';
import fileUpload from 'express-fileupload';

declare global {
  namespace Express {
    interface Request {
      logger: Logger
    }
  }
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // Umgebungsvariablen
  const uploadPath: string = path.join(serverDistFolder, '/uploads')

  // Middlewares für die gesamte App
  server.use(fileUpload());
  server.use(express.json());
  server.use(loggerMiddleware);

  // Routen, welche nur einen Controller ansprechen
  server.post('/api/login', authController.login);
  server.post('/api/init', authController.createHashFile);
  server.get('/api/uploads', authMiddleware, (req, res) => directoryController.getDocxAndPdfFiles(req, res, uploadPath));
  server.delete('/api/uploads/deleteFile', authMiddleware, (req, res) => directoryController.deleteDocxAndPdfFiles(req, res, uploadPath));
  server.delete('/api/uploads', authMiddleware, (req, res) => directoryController.deleteAllFilesInFolder(req, res, uploadPath));
  server.get('/api/uploads/getFile', authMiddleware, (req, res) => directoryController.getFile(req, res, path.join(uploadPath, req.query['name'] as string)));
  server.get('/api/amtsgerichtausplz', scrapingController.amtsgerichtausplz);
  server.delete('/api/deleteLogFile', authMiddleware, directoryController.deleteLogFile);
  server.get('/api/getLogFile', authMiddleware, directoryController.getLogFile);

  // ausgelagerte Routen
  server.use('/', grundbuchausdruckRoute);

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
