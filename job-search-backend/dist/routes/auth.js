"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
const registerValidation = [
    (0, express_validator_1.body)('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2-50 characters'),
    (0, express_validator_1.body)('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2-50 characters'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
const loginValidation = [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
router.post('/register', registerValidation, validate_1.validate, authController_1.register);
router.post('/login', loginValidation, validate_1.validate, authController_1.login);
router.get('/profile', auth_1.authenticate, authController_1.getProfile);
router.put('/profile', auth_1.authenticate, authController_1.updateProfile);
router.post('/profile/resume', auth_1.authenticate, authController_1.updateProfileFromResume);
exports.default = router;
