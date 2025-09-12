"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
const updateProfileValidation = [
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
    (0, express_validator_1.body)('skills').optional().isArray().withMessage('Skills must be an array'),
    (0, express_validator_1.body)('experience').optional().isArray().withMessage('Experience must be an array'),
    (0, express_validator_1.body)('education').optional().isArray().withMessage('Education must be an array'),
    (0, express_validator_1.body)('summary').optional().isString().isLength({ max: 1000 }).withMessage('Summary must be less than 1000 characters'),
];
router.get('/profile', auth_1.authenticate, authController_1.getProfile);
router.put('/profile', auth_1.authenticate, updateProfileValidation, validate_1.validate, authController_1.updateProfile);
exports.default = router;
