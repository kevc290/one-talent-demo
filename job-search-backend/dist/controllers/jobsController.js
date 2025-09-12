"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveJob = exports.saveJob = exports.getSavedJobs = exports.getJobById = exports.getJobs = void 0;
const database_1 = __importDefault(require("../config/database"));
const getJobs = async (req, res) => {
    try {
        const { search = '', type = [], remote, location = '', department = '', salaryMin, salaryMax, company = '', postedWithin, page = 1, limit = 20, sortBy = 'posted_date', sortOrder = 'DESC' } = req.query;
        let whereConditions = ['is_active = true'];
        let queryParams = [];
        let paramCount = 0;
        if (search) {
            paramCount++;
            const searchLower = search.toLowerCase();
            let searchVariations = [searchLower];
            const variations = {
                'engineer': ['engineering', 'eng'],
                'engineering': ['engineer', 'eng'],
                'developer': ['development', 'dev'],
                'development': ['developer', 'dev'],
                'manager': ['management', 'mgr'],
                'management': ['manager', 'mgr'],
                'analyst': ['analysis', 'analytics'],
                'analysis': ['analyst', 'analytics'],
                'designer': ['design', 'designing'],
                'design': ['designer', 'designing'],
                'frontend': ['front-end', 'front end'],
                'backend': ['back-end', 'back end'],
                'fullstack': ['full-stack', 'full stack'],
            };
            for (const [key, values] of Object.entries(variations)) {
                if (searchLower.includes(key)) {
                    searchVariations.push(...values);
                }
            }
            const searchConditions = searchVariations.map((_, index) => {
                const paramIndex = paramCount + index;
                return `(
          title ILIKE $${paramIndex} OR 
          company ILIKE $${paramIndex} OR 
          description ILIKE $${paramIndex} OR 
          location ILIKE $${paramIndex} OR
          department ILIKE $${paramIndex}
        )`;
            }).join(' OR ');
            whereConditions.push(`(${searchConditions})`);
            searchVariations.forEach(variation => {
                queryParams.push(`%${variation}%`);
                paramCount++;
            });
            paramCount--;
        }
        if (Array.isArray(type) && type.length > 0) {
            paramCount++;
            whereConditions.push(`type = ANY($${paramCount})`);
            queryParams.push(type);
        }
        else if (type && typeof type === 'string') {
            paramCount++;
            whereConditions.push(`type = $${paramCount}`);
            queryParams.push(type);
        }
        if (remote !== undefined) {
            paramCount++;
            whereConditions.push(`remote = $${paramCount}`);
            queryParams.push(remote === 'true');
        }
        if (location) {
            paramCount++;
            whereConditions.push(`location ILIKE $${paramCount}`);
            queryParams.push(`%${location}%`);
        }
        if (department) {
            paramCount++;
            whereConditions.push(`department ILIKE $${paramCount}`);
            queryParams.push(`%${department}%`);
        }
        if (company) {
            paramCount++;
            whereConditions.push(`company ILIKE $${paramCount}`);
            queryParams.push(`%${company}%`);
        }
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
        if (postedWithin) {
            paramCount++;
            whereConditions.push(`posted_date >= CURRENT_DATE - INTERVAL '$${paramCount} days'`);
            queryParams.push(parseInt(postedWithin));
        }
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;
        const validSortColumns = ['posted_date', 'title', 'company', 'salary_min', 'salary_max'];
        const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'posted_date';
        const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        const countQuery = `SELECT COUNT(*) FROM jobs ${whereClause}`;
        const countResult = await database_1.default.query(countQuery, queryParams);
        const totalItems = parseInt(countResult.rows[0].count);
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
        const jobsResult = await database_1.default.query(jobsQuery, queryParams);
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
        const totalPages = Math.ceil(totalItems / limitNum);
        const response = {
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
    }
    catch (error) {
        console.error('Get jobs error:', error);
        const response = {
            success: false,
            message: 'Failed to fetch jobs'
        };
        res.status(500).json(response);
    }
};
exports.getJobs = getJobs;
const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const jobResult = await database_1.default.query(`
      SELECT 
        id, title, company, company_logo, department, location, type, remote,
        description, requirements, benefits, salary_min, salary_max, 
        posted_date, expires_date, is_active, created_at
      FROM jobs 
      WHERE id = $1 AND is_active = true
    `, [id]);
        if (jobResult.rows.length === 0) {
            const response = {
                success: false,
                message: 'Job not found'
            };
            res.status(404).json(response);
            return;
        }
        const job = jobResult.rows[0];
        const companyInfo = {
            industry: 'Technology',
            size: '100-500 employees',
            founded: 2010,
            website: `https://www.${job.company.toLowerCase().replace(/\s+/g, '')}.com`,
            description: `${job.company} is a leading company in the ${job.department} industry, committed to innovation and excellence.`
        };
        const response = {
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
    }
    catch (error) {
        console.error('Get job by ID error:', error);
        const response = {
            success: false,
            message: 'Failed to fetch job'
        };
        res.status(500).json(response);
    }
};
exports.getJobById = getJobById;
const getSavedJobs = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const savedJobsResult = await database_1.default.query(`
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
        const response = {
            success: true,
            data: savedJobs
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Get saved jobs error:', error);
        const response = {
            success: false,
            message: 'Failed to fetch saved jobs'
        };
        res.status(500).json(response);
    }
};
exports.getSavedJobs = getSavedJobs;
const saveJob = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { jobId } = req.body;
        const jobResult = await database_1.default.query('SELECT id FROM jobs WHERE id = $1 AND is_active = true', [jobId]);
        if (jobResult.rows.length === 0) {
            const response = {
                success: false,
                message: 'Job not found'
            };
            res.status(404).json(response);
            return;
        }
        try {
            await database_1.default.query('INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2)', [userId, jobId]);
            const response = {
                success: true,
                data: { message: 'Job saved successfully' }
            };
            res.status(201).json(response);
        }
        catch (insertError) {
            if (insertError.code === '23505') {
                const response = {
                    success: true,
                    data: { message: 'Job already saved' }
                };
                res.status(200).json(response);
            }
            else {
                throw insertError;
            }
        }
    }
    catch (error) {
        console.error('Save job error:', error);
        const response = {
            success: false,
            message: 'Failed to save job'
        };
        res.status(500).json(response);
    }
};
exports.saveJob = saveJob;
const unsaveJob = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { jobId } = req.params;
        const result = await database_1.default.query('DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2', [userId, jobId]);
        if (result.rowCount === 0) {
            const response = {
                success: false,
                message: 'Saved job not found'
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            success: true,
            data: { message: 'Job removed from saved successfully' }
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Unsave job error:', error);
        const response = {
            success: false,
            message: 'Failed to remove saved job'
        };
        res.status(500).json(response);
    }
};
exports.unsaveJob = unsaveJob;
