import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { join, resolve } from 'node:path';
import AppServerModule from './src/main.server';
import authMiddleware from './server/middleware/authMiddleware';
import * as authController from './server/controller/authController';
import submitForm from './server/controller/submitFormController';
import uploads from './server/routes/uploadsRoutes';
import fileUpload from 'express-fileupload';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { getAmtsgerichtAusPLZ } from './server/controller/scrapingController';
import { deleteLogFile, getLogFile } from './server/controller/loggerController';
import { generateStatistic as handleGenerateStatistic, getStatistic } from 'server/controller/statisticController';
import { SERVER_DIST_FOLDER, UPLOADS_FOLDER_PATH } from 'server/config/config';


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const browserDistFolder = resolve(SERVER_DIST_FOLDER, '../browser');
  const indexHtml = join(SERVER_DIST_FOLDER, 'index.server.html');

  // Daten aus der .env Datei einlesen
  dotenv.config();

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

  // Routen, welche nur einen Controller ansprechen
  server.post('/api/login', authController.login);
  server.post('/login', authController.login);
  server.get('/api/amtsgerichtausplz', getAmtsgerichtAusPLZ);
  server.delete('/api/deleteLogFile', authMiddleware, deleteLogFile);
  server.get('/api/getLogFile', authMiddleware, getLogFile);
  server.get('/api/getStatistic', authMiddleware, getStatistic);
  server.post('/api/generateStatistic', authMiddleware, handleGenerateStatistic);

  // ausgelagerte Routen
  server.use('/', submitForm);
  server.use('/', uploads)

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
