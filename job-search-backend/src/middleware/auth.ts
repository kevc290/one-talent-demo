import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, ApiResponse } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'No token provided, authorization denied'
      };
      res.status(401).json(response);
      return;
    }

    // Temporary workaround for our temp tokens
    if (token.startsWith('temp_token_')) {
      const userId = token.split('_')[2];
      req.user = {
        userId: userId,
        email: 'temp@example.com' // temporary
      };
    } else {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };
    }

    next();
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      message: 'Token is not valid'
    };
    res.status(401).json(response);
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      // Temporary workaround for our temp tokens
      if (token.startsWith('temp_token_')) {
        const userId = token.split('_')[2];
        req.user = {
          userId: userId,
          email: 'temp@example.com' // temporary
        };
      } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        req.user = {
          userId: decoded.userId,
          email: decoded.email
        };
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};