process.env['TZ'] = 'Europe/Berlin';

import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import './server/interfaces/request.interface';
import { join } from 'node:path';
import { uploadsRoutes } from './server/routes/uploads.routes';
import fileUpload from 'express-fileupload';
import { getAmtsgerichtAusPLZ } from './server/controller/scraping.controller';
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
import { initPdfConverter } from 'server/helpers/file-conversion.helper';
import { errorHandler } from 'server/middleware/error-handler.middleware';
import cookieParser from 'cookie-parser';
import { rateLimiter } from 'server/middleware/rate-limiter';
import { backupRoutes } from 'server/routes/backup.routes';
import { initBackupCronJob } from 'server/services/backup.service';
import { createStorageFolders } from 'server/config/path.config';
import logger from 'server/config/logger.config';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({ trustProxyHeaders: true });

// To get ip from req
app.set('trust proxy', true);

const isBuildRouteExtraction = import.meta.url.includes('/.angular/prerender-root/');

if (!isBuildRouteExtraction) {
  logger.info('Server gestartet.');

  // Init functions
  await createStorageFolders();
  await initDatabase();
  initBackupCronJob();
  void initPdfConverter().catch(err => logger.warn('LibreOffice-UNO-Daemon Warmup beim Start fehlgeschlagen:', err));
}

// Middleware for the entire server
app.use(cookieParser());
app.use('/api/', rateLimiter);
app.use('/api/', fileUpload());
app.use('/api/', express.json());

// Routes that call a controller
app.get('/api/amtsgerichtausplz', getAmtsgerichtAusPLZ);
app.post('/api/submitForm', submitForm);
app.get('/api/getOdtAfterSubmitForm', handleGetOdtAfterSubmitForm);
app.get('/api/getPdfAfterSubmitForm', handleGetPdfAfterSubmitForm);

// Outsourced routes
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/logger', loggerRoutes);
app.use('/api/statistic', statisticRoutes);
app.use('/api/user-management', userManagementRoutes);
app.use('/api/user-settings', userSettingsRoutes);
app.use('/api/userrole', userRoleRoutes);
app.use('/api/backup', backupRoutes);

// 404 for all other API routes
app.all('/api/*splat', (req, res) => res.status(404).send({ message: 'Route ' + req.url + ' nicht gefunden' }));

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false
  })
);

/**
 * Handle all other GET/HEAD requests by rendering the Angular application.
 * Non-GET/HEAD requests outside /api (e.g. bot POST scans to /admin) are rejected with 404.
 */
app.use((req, res, next) => {
  if ((req.method !== 'GET' && req.method !== 'HEAD') || req.path.startsWith('/.well-known/')) {
    res.status(404).end();
    return;
  }

  angularApp
    .handle(req)
    .then(response => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

app.use(errorHandler);

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  process.env['SSR_LOCAL_ORIGIN'] = `http://127.0.0.1:${port}`;
  app.listen(port, error => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
