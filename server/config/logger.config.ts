import { createLogger, transports, format } from 'winston';
import { LOG_FILE_PATH } from './path.config';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: LOG_FILE_PATH,
            maxsize: 10000000,
            maxFiles: 5,
            tailable: true,
        }),
    ],
    exitOnError: false,
});

export default logger;
