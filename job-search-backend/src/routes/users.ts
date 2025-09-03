import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { getProfile, updateProfile } from '../controllers/authController';

const router = Router();

// Validation rules
const updateProfileValidation = [
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('experience').optional().isArray().withMessage('Experience must be an array'),
  body('education').optional().isArray().withMessage('Education must be an array'),
  body('summary').optional().isString().isLength({ max: 1000 }).withMessage('Summary must be less than 1000 characters'),
];

// Routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, validate, updateProfile);

export default router;