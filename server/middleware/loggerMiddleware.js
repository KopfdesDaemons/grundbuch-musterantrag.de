const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: './server/logFile.log',
            maxsize: 10000000,
            maxFiles: 5,
            tailable: true
        })
    ],
    exitOnError: false
});

module.exports = (req, res, next) => {
    req.logger = logger;
    next();
};
