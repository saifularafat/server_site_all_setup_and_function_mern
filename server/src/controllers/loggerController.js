const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp({
        format: 'YYYY-MM-DD HH:MM:SS'
    }), format.json()),
    transports: [
        new transports.File({
            filename: 'src/logs/info.log',
            level: 'info',
            // maxsize: 5242880, //5mb
            // maxFiles: 5,
        }),
        new transports.File({
            filename: 'src/logs/error.log',
            level: 'error',
            // maxsize: 5242880, //5mb
            // maxFiles: 5,
        }),
    ],
});

module.exports = logger;