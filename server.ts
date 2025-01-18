import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { resolve } from 'node:path';
import authMiddleware from './server/middleware/authMiddleware';
import * as authController from './server/controller/authController';
import submitForm from './server/controller/submitFormController';
import uploads from './server/routes/uploadsRoutes';
import fileUpload from 'express-fileupload';
import { getAmtsgerichtAusPLZ } from './server/controller/scrapingController';
import { deleteLogFile, getLogFile } from './server/controller/loggerController';
import { handleGetStatistic } from 'server/controller/statisticController';
import { SERVER_DIST_FOLDER } from 'server/config/config';
import { handleMigrateFromJSONFilesToDatabase, handleMigrationFromAntragToUploadinfo } from 'server/controller/migrationController';
import { handleGetPrimaryColor, handleGetSettings, handleSaveSettings } from 'server/controller/settingsController';
import { initializeDatabase as initDatabase } from 'server/services/databaseService';
import { Feature, PermissionAction, UserPermission } from 'server/interfaces/userPermission';
import { verifyRole } from 'server/middleware/verifyUserRoleMiddleware';


export async function app(): Promise<express.Express> {
  const server = express();
  const browserDistFolder = resolve(SERVER_DIST_FOLDER, '../browser');

  const angularNodeAppEngine = new AngularNodeAppEngine();

  await initDatabase();

  // Middlewares für die gesamte App
  server.use(fileUpload());
  server.use(express.json());

  server.post('/api/login', authController.handleLogin);
  server.get('/api/checkAuth', authController.checkToken);
  server.get('/api/amtsgerichtausplz', getAmtsgerichtAusPLZ);
  server.delete('/api/deleteLogFile', authMiddleware, verifyRole(new UserPermission(Feature.Logger, [PermissionAction.Delete])), deleteLogFile);
  server.get('/api/getLogFile', authMiddleware, verifyRole(new UserPermission(Feature.Logger, [PermissionAction.Read])), getLogFile);
  server.get('/api/getStatistic', authMiddleware, verifyRole(new UserPermission(Feature.Statistic, [PermissionAction.Read])), handleGetStatistic);
  server.post('/api/migration/fromAntragToUploadinfo', authMiddleware, verifyRole(new UserPermission(Feature.Migration, [PermissionAction.Create, PermissionAction.Read, PermissionAction.Update, PermissionAction.Delete])), handleMigrationFromAntragToUploadinfo);
  server.post('/api/migration/fromJSONToDatabase', authMiddleware, verifyRole(new UserPermission(Feature.Migration, [PermissionAction.Create, PermissionAction.Read, PermissionAction.Update, PermissionAction.Delete])), handleMigrateFromJSONFilesToDatabase);
  server.get('/api/settings', authMiddleware, verifyRole(new UserPermission(Feature.Settings, [PermissionAction.Read])), handleGetSettings);
  server.put('/api/settings', authMiddleware, verifyRole(new UserPermission(Feature.Settings, [PermissionAction.Update])), handleSaveSettings);
  server.get('/api/settings/getPrimaryColor', handleGetPrimaryColor);

  // ausgelagerte Routen
  server.use('/', submitForm);
  server.use('/', uploads);

  // Routen, welche die Angular Engine ansprechen
  server.get('**', express.static(browserDistFolder, { maxAge: '1y', index: 'index.html' }));

  server.get('**', (req, res, next) => {
    console.log('request', req.url);

    angularNodeAppEngine
      .handle(req, { server: 'express' })
      .then((response) =>
        response ? writeResponseToNodeResponse(response, res) : next()
      )
      .catch(next);
  });

  return server;
}

const server = await app();

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
export const reqHandler = createNodeRequestHandler(server);