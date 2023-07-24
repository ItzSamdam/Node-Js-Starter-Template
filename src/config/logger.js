import { format as _format, createLogger, transports as _transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { logConfig } from './config';


const enumerateErrorFormat = _format((info) => {
    if (info.message instanceof Error) {
        info.message = {
            message: info.message.message,
            stack: info.message.stack,
            ...info.message,
        };
    }

    if (info instanceof Error) {
        return { message: info.message, stack: info.stack, ...info };
    }

    return info;
});
const transport = new DailyRotateFile({
    filename: logConfig.logFolder + logConfig.logFile,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '3',
    prepend: true,
});
transport.on('rotate', (oldFilename, newFilename) => {
    // call function like upload to s3 or on cloud
});

//system logger
const logger = createLogger({
    format: _format.combine(enumerateErrorFormat(), _format.json()),
    transports: [
        transport,
        new _transports.Console({
            level: 'info',
        }),
    ],
});
export default logger;
