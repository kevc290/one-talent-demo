import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import pool from '../config/database';
import { User, ApiResponse, JWTPayload } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'User already exists with this email'
      };
      res.status(400).json(response);
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, first_name, last_name, created_at`,
      [email, passwordHash, firstName, lastName]
    );

    const user = newUser.rows[0];

    // Create user profile
    await pool.query(
      'INSERT INTO user_profiles (user_id) VALUES ($1)',
      [user.id]
    );

    // Generate JWT
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email
    };

    // Temporary workaround for JWT signing
    const token = `temp_token_${user.id}_${Date.now()}`;

    const response: ApiResponse<{ user: any; token: string }> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          joinedDate: user.created_at.toISOString().split('T')[0]
        },
        token
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to create account'
    };
    res.status(500).json(response);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find user
    const userResult = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, avatar, created_at FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Invalid credentials'
      };
      res.status(401).json(response);
      return;
    }

    const user = userResult.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Invalid credentials'
      };
      res.status(401).json(response);
      return;
    }

    // Get user profile
    const profileResult = await pool.query(
      'SELECT phone, skills, experience, education, summary, resume_filename, resume_upload_date FROM user_profiles WHERE user_id = $1',
      [user.id]
    );

    const profile = profileResult.rows[0] || null;

    // Generate JWT
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email
    };

    // Temporary workaround for JWT signing
    const token = `temp_token_${user.id}_${Date.now()}`;

    const response: ApiResponse<{ user: any; token: string }> = {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar: user.avatar,
          joinedDate: user.created_at.toISOString().split('T')[0],
          profile: profile ? {
            phone: profile.phone,
            skills: profile.skills,
            experience: profile.experience,
            education: profile.education,
            summary: profile.summary,
            resumeFileName: profile.resume_filename,
            resumeUploadDate: profile.resume_upload_date?.toISOString()
          } : null
        },
        token
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Login failed'
    };
    res.status(500).json(response);
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const userResult = await pool.query(
      'SELECT id, email, first_name, last_name, avatar, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'User not found'
      };
      res.status(404).json(response);
      return;
    }

    const user = userResult.rows[0];

    // Get user profile
    const profileResult = await pool.query(
      'SELECT phone, skills, experience, education, summary, resume_filename, resume_upload_date FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    const profile = profileResult.rows[0] || null;

    const response: ApiResponse<any> = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        avatar: user.avatar,
        joinedDate: user.created_at.toISOString().split('T')[0],
        profile: profile ? {
          phone: profile.phone,
          skills: profile.skills,
          experience: profile.experience,
          education: profile.education,
          summary: profile.summary,
          resumeFileName: profile.resume_filename,
          resumeUploadDate: profile.resume_upload_date?.toISOString()
        } : null
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get profile error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to get profile'
    };
    res.status(500).json(response);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { phone, skills, experience, education, summary } = req.body;

    await pool.query(
      `UPDATE user_profiles 
       SET phone = $1, skills = $2, experience = $3, education = $4, summary = $5, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6`,
      [phone, skills, experience, education, summary, userId]
    );

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Profile updated successfully' }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update profile error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to update profile'
    };
    res.status(500).json(response);
  }
};

export const updateProfileFromResume = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { fullName, email, phone, skills, experience, education, summary, resumeFileName } = req.body;

    // Update user info if provided
    if (fullName) {
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3',
        [firstName, lastName, userId]
      );
    }

    // Update profile
    await pool.query(
      `UPDATE user_profiles 
       SET phone = COALESCE($1, phone), 
           skills = COALESCE($2, skills), 
           experience = COALESCE($3, experience), 
           education = COALESCE($4, education), 
           summary = COALESCE($5, summary),
           resume_filename = $6,
           resume_upload_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $7`,
      [phone, skills, experience, education, summary, resumeFileName, userId]
    );

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Profile updated from resume successfully' }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update profile from resume error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to update profile from resume'
    };
    res.status(500).json(response);
  }
};