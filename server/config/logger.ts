import { createLogger, transports, format } from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';


const SERVER_DIST_FOLDER = path.dirname(fileURLToPath(import.meta.url));

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
            filename: SERVER_DIST_FOLDER + '/logFile.log',
            maxsize: 10000000,
            maxFiles: 5,
            tailable: true,
        }),
    ],
    exitOnError: false,
});

export default logger;
