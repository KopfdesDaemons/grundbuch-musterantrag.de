import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { resolve } from 'node:path';
import { submitFormRoutes } from './server/routes/submitFormController';
import { uploadsRoutes } from './server/routes/uploadsRoutes';
import fileUpload from 'express-fileupload';
import { getAmtsgerichtAusPLZ } from './server/controller/scrapingController';
import { SERVER_DIST_FOLDER } from 'server/config/config';
import { initDatabase } from 'server/services/databaseService';
import { settingsRoutes } from 'server/routes/settingsRoutes';
import { migrationRoutes } from 'server/routes/migrationRoutes';
import { loggerRoutes } from 'server/routes/loggerRoutes';
import { authRoutes } from 'server/routes/authRoutes';
import { statisticRoutes } from 'server/routes/statisticRoutes';
import { userRoutes } from 'server/routes/userRoutes';
import { userRoleRoutes } from 'server/routes/userRoleRoutes';

export async function app(): Promise<express.Express> {
  const server = express();
  const browserDistFolder = resolve(SERVER_DIST_FOLDER, '../browser');
  const angularNodeAppEngine = new AngularNodeAppEngine();

  await initDatabase();

  // Middlewares für die gesamte App
  server.use(fileUpload());
  server.use(express.json());

  server.get('/api/amtsgerichtausplz', getAmtsgerichtAusPLZ);

  // ausgelagerte Routen
  server.use('/api/auth', authRoutes);
  server.use('/api/submitForm', submitFormRoutes);
  server.use('/api/uploads', uploadsRoutes);
  server.use('/api/settings', settingsRoutes);
  server.use('/api/migration', migrationRoutes);
  server.use('/api/logger', loggerRoutes);
  server.use('/api/statistic', statisticRoutes);
  server.use('/api/user', userRoutes);
  server.use('/api/userrole', userRoleRoutes);

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