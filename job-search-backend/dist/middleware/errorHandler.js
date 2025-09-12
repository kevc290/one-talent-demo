"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    if (err.name === 'MongoError' || err.code === '23505') {
        statusCode = 400;
        message = 'Duplicate field value entered';
    }
    if (err.code === '23503') {
        statusCode = 400;
        message = 'Referenced resource does not exist';
    }
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    }
    console.error(`Error ${statusCode}: ${message}`);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            errors: [err.stack || '']
        })
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
