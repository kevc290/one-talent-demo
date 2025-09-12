"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            const response = {
                success: false,
                message: 'No token provided, authorization denied'
            };
            res.status(401).json(response);
            return;
        }
        if (token.startsWith('temp_token_')) {
            const userId = token.split('_')[2];
            req.user = {
                userId: userId,
                email: 'temp@example.com'
            };
        }
        else {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = {
                userId: decoded.userId,
                email: decoded.email
            };
        }
        next();
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Token is not valid'
        };
        res.status(401).json(response);
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            if (token.startsWith('temp_token_')) {
                const userId = token.split('_')[2];
                req.user = {
                    userId: userId,
                    email: 'temp@example.com'
                };
            }
            else {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email
                };
            }
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
