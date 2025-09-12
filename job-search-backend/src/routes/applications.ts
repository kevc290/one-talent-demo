import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import pool from '../config/database';
import { ApiResponse } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';
import { Request, Response } from 'express';

const router = Router();

// Get user applications
const getUserApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const applicationsResult = await pool.query(`
      SELECT 
        a.id, a.job_id, a.status, a.applied_date, a.cover_letter, a.resume_filename, a.notes,
        j.title as job_title, j.company, j.location, j.type
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = $1
      ORDER BY a.applied_date DESC
    `, [userId]);

    const applications = applicationsResult.rows.map(app => ({
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title,
      company: app.company,
      location: app.location,
      type: app.type,
      status: app.status,
      appliedDate: app.applied_date.toISOString().split('T')[0],
      coverLetter: app.cover_letter,
      resumeFilename: app.resume_filename,
      notes: app.notes
    }));

    const response: ApiResponse<any[]> = {
      success: true,
      data: applications
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get applications error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch applications'
    };
    res.status(500).json(response);
  }
};

// Submit job application
const submitApplication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { jobId, coverLetter, resumeFilename } = req.body;

    // Check if job exists and is active
    const jobResult = await pool.query('SELECT id FROM jobs WHERE id = $1 AND is_active = true', [jobId]);
    
    if (jobResult.rows.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Job not found'
      };
      res.status(404).json(response);
      return;
    }

    // Check if user already applied
    const existingApplication = await pool.query(
      'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );

    if (existingApplication.rows.length > 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'You have already applied for this job'
      };
      res.status(400).json(response);
      return;
    }

    // Create application
    const applicationResult = await pool.query(
      `INSERT INTO applications (user_id, job_id, cover_letter, resume_filename) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, applied_date`,
      [userId, jobId, coverLetter, resumeFilename]
    );

    const application = applicationResult.rows[0];

    const response: ApiResponse<any> = {
      success: true,
      data: {
        id: application.id,
        appliedDate: application.applied_date.toISOString().split('T')[0],
        message: 'Application submitted successfully'
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Submit application error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to submit application'
    };
    res.status(500).json(response);
  }
};

// Validation rules
const submitApplicationValidation = [
  body('jobId')
    .custom((value) => {
      // Accept UUIDs or numeric IDs
      const isUuid = typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
      const isNumeric = /^\d+$/.test(String(value));
      return isUuid || isNumeric;
    })
    .withMessage('Invalid job ID'),
  body('coverLetter').isString().isLength({ min: 10, max: 2000 }).withMessage('Cover letter must be between 10 and 2000 characters'),
  body('resumeFilename').optional().isString().withMessage('Resume filename must be a string'),
];

// Routes
router.get('/', authenticate, getUserApplications);
router.post('/', authenticate, submitApplicationValidation, validate, submitApplication);

export default router;