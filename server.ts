import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { resolve } from 'node:path';
import { uploadsRoutes } from './server/routes/uploads.routes';
import fileUpload from 'express-fileupload';
import { getAmtsgerichtAusPLZ } from './server/controller/scraping.controller';
import { SERVER_DIST_FOLDER } from 'server/config/path.config';
import { initDatabase } from 'server/services/database.service';
import { settingsRoutes } from 'server/routes/settings.routes';
import { migrationRoutes } from 'server/routes/migration.routes';
import { loggerRoutes } from 'server/routes/logger.routes';
import { authRoutes } from 'server/routes/auth.routes';
import { statisticRoutes } from 'server/routes/statistic.routes';
import { userManagementRoutes } from 'server/routes/user-management.routes';
import { userRoleRoutes } from 'server/routes/user-role.routes';
import { userSettingsRoutes } from 'server/routes/user-settings.routes';
import { handleGetOdtAfterSubmitForm, handleGetPdfAfterSubmitForm, submitForm } from 'server/controller/submit-form.controller';

export async function app(): Promise<express.Express> {
  const server = express();
  const browserDistFolder = resolve(SERVER_DIST_FOLDER, '../browser');
  const angularNodeAppEngine = new AngularNodeAppEngine();

  await initDatabase();

  // Middleware for the entire server
  server.use(fileUpload());
  server.use(express.json());

  // Routes that call a controller
  server.get('/api/amtsgerichtausplz', getAmtsgerichtAusPLZ);
  server.post('/api/submitForm', submitForm);
  server.get('/api/getOdtAfterSubmitForm', handleGetOdtAfterSubmitForm);
  server.get('/api/getPdfAfterSubmitForm', handleGetPdfAfterSubmitForm);

  // Outsourced routes
  server.use('/api/auth', authRoutes);
  server.use('/api/uploads', uploadsRoutes);
  server.use('/api/settings', settingsRoutes);
  server.use('/api/migration', migrationRoutes);
  server.use('/api/logger', loggerRoutes);
  server.use('/api/statistic', statisticRoutes);
  server.use('/api/user-management', userManagementRoutes);
  server.use('/api/user-settings', userSettingsRoutes);
  server.use('/api/userrole', userRoleRoutes);

  // 404 for all other API routes
  server.all('/api/*', (req, res) => res.status(404).send({ message: 'Route ' + req.url + ' nicht gefunden' }));

  // Angular routes
  server.get('**', express.static(browserDistFolder, { maxAge: '1y', index: 'index.html' }));

  server.get('**', (req, res, next) => {
    console.log('request', req.url);

    angularNodeAppEngine
      .handle(req, { server: 'express' })
      .then(response => (response ? writeResponseToNodeResponse(response, res) : next()))
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
