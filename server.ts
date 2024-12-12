import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { resolve } from 'node:path';
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
import { handleMigrationFromAntragToUploadinfo } from 'server/controller/migrationController';
import { SettingsService } from 'server/services/settingsService';
import { handleGetSettings, handleSaveSettings } from 'server/controller/settingsController';


export function app(): express.Express {
  const server = express();
  const browserDistFolder = resolve(SERVER_DIST_FOLDER, '../browser');

  const angularNodeAppEngine = new AngularNodeAppEngine();

  // Daten aus der .env Datei einlesen
  dotenv.config();

  // Überprüfe, ob der Uploads Ordner existiert und erstelle ihn bei Bedarf
  if (!fs.existsSync(UPLOADS_FOLDER_PATH)) fs.mkdirSync(UPLOADS_FOLDER_PATH, { recursive: true });

  SettingsService.initSettings();

  // Middlewares für die gesamte App
  server.use(fileUpload());
  server.use(express.json());

  server.post('/api/login', authController.login);
  server.get('/api/checkAuth', authController.checkToken);
  server.get('/api/amtsgerichtausplz', getAmtsgerichtAusPLZ);
  server.delete('/api/deleteLogFile', authMiddleware, deleteLogFile);
  server.get('/api/getLogFile', authMiddleware, getLogFile);
  server.get('/api/getStatistic', authMiddleware, getStatistic);
  server.post('/api/generateStatistic', authMiddleware, handleGenerateStatistic);
  server.post('/api/migration/fromAntragToUploadinfo', authMiddleware, handleMigrationFromAntragToUploadinfo);
  server.get('/api/settings', authMiddleware, handleGetSettings);
  server.put('/api/settings', authMiddleware, handleSaveSettings);

  // ausgelagerte Routen
  server.use('/', submitForm);
  server.use('/', uploads);

  // Routen, welche die Angular Engine ansprechen
  server.get('**', express.static(browserDistFolder, { maxAge: '1y', index: 'index.html' }));


  server.get('**', (req, res, next) => {
    console.log('request', req.url, res.status);

    angularNodeAppEngine
      .handle(req, { server: 'express' })
      .then((response) =>
        response ? writeResponseToNodeResponse(response, res) : next()
      )
      .catch(next);
  });

  return server;
}

const server = app();

const port = process.env['PORT'] || 4000;
server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});

export const reqHandler = createNodeRequestHandler(server);