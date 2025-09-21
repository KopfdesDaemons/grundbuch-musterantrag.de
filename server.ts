import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
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
import { errorHandler } from 'server/middleware/error-handler.middleware';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

await initDatabase();

// Middleware for the entire server
app.use(fileUpload());
app.use(express.json());

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
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
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
