import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // MongoDB/PostgreSQL duplicate key error
  if (err.name === 'MongoError' || (err as any).code === '23505') {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // PostgreSQL foreign key constraint error
  if ((err as any).code === '23503') {
    statusCode = 400;
    message = 'Referenced resource does not exist';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  console.error(`Error ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const response: ApiResponse<null> = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      errors: [err.stack || ''] 
    })
  };

  res.status(statusCode).json(response);
};