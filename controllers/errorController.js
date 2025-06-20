import AppError from '../utils/appError.js';
import logger from '../utils/logger.js';

const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    logger.error('Development error details', {
        name: error.name,
        message: error.message,
        stack: stack
    });
    res.status(statusCode).json({
        status,
        error: error,
        message,
        stack,
    });
};

const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if (error.isOperational) {
        return res.status(statusCode).json({
            status,
            message,
        });
    }

    logger.error('Error details', {
        name: error.name,
        message: error.message,
        stack: stack
    });
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    });
};

const globalErrorHandler = (err, req, res, next) => {
    if (err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid token', 401);
    }
    if (err.name === 'SequelizeValidationError') {
        err = new AppError(err.errors[0].message, 400);
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
        err = new AppError(err.errors[0].message, 400);
    }
    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
};

export default { globalErrorHandler }
