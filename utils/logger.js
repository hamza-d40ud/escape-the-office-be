import winston from 'winston';
import 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { format } from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Custom format for error objects
const errorFormat = format((info) => {
    if (info.error) {
        // If it's an Error object
        if (info.error instanceof Error) {
            info.message = `${info.message} - ${info.error.message}`;
            if (info.error.stack) {
                info.stack = info.error.stack;
            }
        }
        // If it's a string or object that needs to be stringified
        else if (typeof info.error === 'object') {
            try {
                // Check if it's an array-like object (has numeric keys)
                const keys = Object.keys(info.error);
                if (keys.every(key => !isNaN(parseInt(key)))) {
                    // Convert array-like object to string
                    const errorStr = keys
                        .sort((a, b) => parseInt(a) - parseInt(b))
                        .map(key => info.error[key])
                        .join('');
                    info.message = `${info.message} - ${errorStr}`;
                } else {
                    info.message = `${info.message} - ${JSON.stringify(info.error)}`;
                }
            } catch (e) {
                info.message = `${info.message} - [Object could not be stringified]`;
            }
        } else {
            info.message = `${info.message} - ${info.error}`;
        }
        delete info.error;
    }
    return info;
});

// Custom format for console (development)
const consoleFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
    })
);

// Custom format for files and Loki (production)
const fileFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errorFormat(),
    format.splat(),
    format.json()
);

// Create transports array
const transports = [
    // Console transport with development format
    new winston.transports.Console({
        format: consoleFormat,
        handleExceptions: true,
        handleRejections: true
    }),
    // File transports with production format
    new winston.transports.DailyRotateFile({
        filename: path.join(logsDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '100m',
        maxFiles: '30d',
        zippedArchive: true,
        tailable: true,
        handleExceptions: true,
        handleRejections: true,
        format: fileFormat
    }),
    new winston.transports.DailyRotateFile({
        filename: path.join(logsDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '100m',
        maxFiles: '30d',
        zippedArchive: true,
        tailable: true,
        handleExceptions: true,
        handleRejections: true,
        format: fileFormat
    })
];

// Add Loki transport if in production
if (process.env.LOKI_HOST) {
    transports.push(
        new LokiTransport({
            host: process.env.LOKI_HOST,
            json: true,
            format: format.combine(
                format.timestamp(),
                errorFormat(),
                format.json()
            ),
            labels: {
                job: 'eto-backend',
                environment: process.env.NODE_ENV || 'development'
            },
            batching: true,
            interval: 5,
            replaceTimestamp: true,
            onConnectionError: (err) => console.error('Loki connection error:', err)
        })
    );
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: fileFormat,
    defaultMeta: { 
        service: 'eto-backend',
        environment: process.env.NODE_ENV || 'development'
    },
    transports,
    exceptionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, 'exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '100m',
            maxFiles: '30d',
            zippedArchive: true,
            tailable: true,
            format: fileFormat
        })
    ],
    rejectionHandlers: [
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, 'rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '100m',
            maxFiles: '30d',
            zippedArchive: true,
            tailable: true,
            format: fileFormat
        })
    ]
});

// Create a stream object for Morgan integration
logger.stream = {
    write: (message) => logger.info(message.trim())
};

export default logger; 