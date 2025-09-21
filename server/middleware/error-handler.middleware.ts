import { Request, Response, NextFunction } from 'express';
import logger from 'server/config/logger.config';
import { ValidationError } from 'server/models/errors/validation-error.model';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    logger.warn(`Validation Error: ${err.message} - Path: ${req.originalUrl}`);
    return res.status(err.statusCode).json({ message: err.message });
  }

  logger.error('Unhandled Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl
  });

  if (err) return res.status(500).json({ message: 'Internal Server Error' });
  else return next();
};
