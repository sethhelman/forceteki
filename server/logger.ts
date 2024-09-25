import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const rotate = new DailyRotateFile({
    filename: __dirname + '/logs/forceteki',
    datePattern: '-yyyy-MM-dd.log',
    json: false,
    zippedArchive: true
});

export const logger = winston.createLogger({
    transports: [new winston.transports.Console(), rotate],
    format: winston.format.timestamp()
});
