import { Router } from 'express';
import { query } from 'express-validator';
import {
  getJobs,
  getJobById,
  getSavedJobs,
  saveJob,
  unsaveJob
} from '../controllers/jobsController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

// Validation rules
const getJobsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('salaryMin').optional().isInt({ min: 0 }).withMessage('Salary min must be a positive number'),
  query('salaryMax').optional().isInt({ min: 0 }).withMessage('Salary max must be a positive number'),
  query('remote').optional().isBoolean().withMessage('Remote must be a boolean'),
  query('postedWithin').optional().isInt({ min: 1 }).withMessage('Posted within must be a positive number'),
];

// Routes
router.get('/', getJobsValidation, validate, getJobs);
router.get('/saved', authenticate, getSavedJobs);
router.get('/:id', getJobById);
router.post('/save', authenticate, saveJob);
router.delete('/save/:jobId', authenticate, unsaveJob);

export default router;