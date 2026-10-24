import { Request, Response, NextFunction } from 'express';
import logger from 'server/config/logger.config';
import { AuthError } from 'server/models/errors/auth-error.model';
import { ValidationError } from 'server/models/errors/validation-error.model';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    logger.warn(`Validation Error: ${err.message} - Path: ${req.originalUrl}`);
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Typische Bot-/Client-Fehler (kaputte URLs, ungültiges JSON, abgebrochene Requests) ohne Server-Error-Log abweisen
  if (err instanceof URIError) {
    return res.status(400).json({ message: 'Invalid URI' });
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }

  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Payload Too Large' });
  }

  if (err?.type === 'request.aborted' || err?.code === 'ECONNRESET') {
    if (!res.headersSent) {
      return res.status(400).end();
    }
    return res;
  }

  if (err instanceof TypeError && typeof err.message === 'string' && err.message.includes('Response body object should not be disturbed or locked')) {
    return res.status(400).end();
  }

  logger.error('Unhandled Server Error:', {
    message: err.message,
    stack: err.stack,
    route: req.originalUrl
  });

  if (err) return res.status(500).json({ message: 'Internal Server Error' });
  else return next();
};
