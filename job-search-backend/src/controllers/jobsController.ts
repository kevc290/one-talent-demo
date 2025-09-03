import { Request, Response } from 'express';
import pool from '../config/database';
import { Job, ApiResponse, PaginatedResponse, JobFilters, PaginationOptions } from '../types';
import { AuthenticatedRequest } from '../middleware/auth';

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search = '',
      type = [],
      remote,
      location = '',
      department = '',
      salaryMin,
      salaryMax,
      company = '',
      postedWithin,
      page = 1,
      limit = 20,
      sortBy = 'posted_date',
      sortOrder = 'DESC'
    } = req.query as any;

    // Build WHERE clause
    let whereConditions: string[] = ['is_active = true'];
    let queryParams: any[] = [];
    let paramCount = 0;

    // Search filter
    if (search) {
      paramCount++;
      whereConditions.push(`(
        title ILIKE $${paramCount} OR 
        company ILIKE $${paramCount} OR 
        description ILIKE $${paramCount} OR 
        location ILIKE $${paramCount}
      )`);
      queryParams.push(`%${search}%`);
    }

    // Job type filter
    if (Array.isArray(type) && type.length > 0) {
      paramCount++;
      whereConditions.push(`type = ANY($${paramCount})`);
      queryParams.push(type);
    } else if (type && typeof type === 'string') {
      paramCount++;
      whereConditions.push(`type = $${paramCount}`);
      queryParams.push(type);
    }

    // Remote filter
    if (remote !== undefined) {
      paramCount++;
      whereConditions.push(`remote = $${paramCount}`);
      queryParams.push(remote === 'true');
    }

    // Location filter
    if (location) {
      paramCount++;
      whereConditions.push(`location ILIKE $${paramCount}`);
      queryParams.push(`%${location}%`);
    }

    // Department filter
    if (department) {
      paramCount++;
      whereConditions.push(`department ILIKE $${paramCount}`);
      queryParams.push(`%${department}%`);
    }

    // Company filter
    if (company) {
      paramCount++;
      whereConditions.push(`company ILIKE $${paramCount}`);
      queryParams.push(`%${company}%`);
    }

    // Salary filters
    if (salaryMin) {
      paramCount++;
      whereConditions.push(`salary_max >= $${paramCount}`);
      queryParams.push(parseInt(salaryMin));
    }

    if (salaryMax) {
      paramCount++;
      whereConditions.push(`salary_min <= $${paramCount}`);
      queryParams.push(parseInt(salaryMax));
    }

    // Posted within filter (days)
    if (postedWithin) {
      paramCount++;
      whereConditions.push(`posted_date >= CURRENT_DATE - INTERVAL '$${paramCount} days'`);
      queryParams.push(parseInt(postedWithin));
    }

    // Build the WHERE clause
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Valid sort columns
    const validSortColumns = ['posted_date', 'title', 'company', 'salary_min', 'salary_max'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'posted_date';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM jobs ${whereClause}`;
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count);

    // Get jobs
    paramCount++;
    const limitParam = paramCount;
    paramCount++;
    const offsetParam = paramCount;
    queryParams.push(limitNum, offset);

    const jobsQuery = `
      SELECT 
        id, title, company, company_logo, department, location, type, remote,
        description, requirements, benefits, salary_min, salary_max, 
        posted_date, expires_date, created_at
      FROM jobs 
      ${whereClause}
      ORDER BY ${sortColumn} ${sortDirection}
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;

    const jobsResult = await pool.query(jobsQuery, queryParams);

    // Transform the data
    const jobs = jobsResult.rows.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      companyLogo: job.company_logo,
      department: job.department,
      location: job.location,
      type: job.type,
      remote: job.remote,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      salary: {
        min: job.salary_min,
        max: job.salary_max
      },
      postedDate: job.posted_date.toISOString().split('T')[0],
      expiresDate: job.expires_date?.toISOString().split('T')[0]
    }));

    // Pagination info
    const totalPages = Math.ceil(totalItems / limitNum);

    const response: ApiResponse<PaginatedResponse<any>> = {
      success: true,
      data: {
        data: jobs,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          itemsPerPage: limitNum,
          hasNext: pageNum < totalPages,
          hasPrevious: pageNum > 1
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get jobs error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch jobs'
    };
    res.status(500).json(response);
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const jobResult = await pool.query(`
      SELECT 
        id, title, company, company_logo, department, location, type, remote,
        description, requirements, benefits, salary_min, salary_max, 
        posted_date, expires_date, is_active, created_at
      FROM jobs 
      WHERE id = $1 AND is_active = true
    `, [id]);

    if (jobResult.rows.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Job not found'
      };
      res.status(404).json(response);
      return;
    }

    const job = jobResult.rows[0];

    // Get company info (we'll create a simplified version for now)
    const companyInfo = {
      industry: 'Technology', // This would come from a companies table
      size: '100-500 employees',
      founded: 2010,
      website: `https://www.${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
      description: `${job.company} is a leading company in the ${job.department} industry, committed to innovation and excellence.`
    };

    const response: ApiResponse<any> = {
      success: true,
      data: {
        id: job.id,
        title: job.title,
        company: job.company,
        companyLogo: job.company_logo,
        department: job.department,
        location: job.location,
        type: job.type,
        remote: job.remote,
        description: job.description,
        requirements: job.requirements,
        benefits: job.benefits,
        salary: {
          min: job.salary_min,
          max: job.salary_max
        },
        postedDate: job.posted_date.toISOString().split('T')[0],
        expiresDate: job.expires_date?.toISOString().split('T')[0],
        companyInfo
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get job by ID error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch job'
    };
    res.status(500).json(response);
  }
};

export const getSavedJobs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const savedJobsResult = await pool.query(`
      SELECT 
        j.id, j.title, j.company, j.company_logo, j.department, j.location, 
        j.type, j.remote, j.description, j.salary_min, j.salary_max, 
        j.posted_date, sj.saved_date
      FROM saved_jobs sj
      JOIN jobs j ON sj.job_id = j.id
      WHERE sj.user_id = $1 AND j.is_active = true
      ORDER BY sj.saved_date DESC
    `, [userId]);

    const savedJobs = savedJobsResult.rows.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      companyLogo: job.company_logo,
      department: job.department,
      location: job.location,
      type: job.type,
      remote: job.remote,
      description: job.description,
      salary: {
        min: job.salary_min,
        max: job.salary_max
      },
      postedDate: job.posted_date.toISOString().split('T')[0],
      savedDate: job.saved_date.toISOString()
    }));

    const response: ApiResponse<any[]> = {
      success: true,
      data: savedJobs
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get saved jobs error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to fetch saved jobs'
    };
    res.status(500).json(response);
  }
};

export const saveJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.body;

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

    // Try to insert (will fail if already saved due to unique constraint)
    try {
      await pool.query(
        'INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2)',
        [userId, jobId]
      );

      const response: ApiResponse<{ message: string }> = {
        success: true,
        data: { message: 'Job saved successfully' }
      };

      res.status(201).json(response);
    } catch (insertError: any) {
      if (insertError.code === '23505') { // Unique constraint violation
        const response: ApiResponse<{ message: string }> = {
          success: true,
          data: { message: 'Job already saved' }
        };
        res.status(200).json(response);
      } else {
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Save job error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to save job'
    };
    res.status(500).json(response);
  }
};

export const unsaveJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    const result = await pool.query(
      'DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2',
      [userId, jobId]
    );

    if (result.rowCount === 0) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Saved job not found'
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Job removed from saved successfully' }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Unsave job error:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to remove saved job'
    };
    res.status(500).json(response);
  }
};