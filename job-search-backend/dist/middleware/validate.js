"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const response = {
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(error => error.msg)
        };
        res.status(400).json(response);
        return;
    }
    next();
};
exports.validate = validate;
