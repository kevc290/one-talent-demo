"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileFromResume = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await database_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            const response = {
                success: false,
                message: 'User already exists with this email'
            };
            res.status(400).json(response);
            return;
        }
        const saltRounds = 12;
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        const newUser = await database_1.default.query(`INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, first_name, last_name, created_at`, [email, passwordHash, firstName, lastName]);
        const user = newUser.rows[0];
        await database_1.default.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [user.id]);
        const payload = {
            userId: user.id,
            email: user.email
        };
        const token = `temp_token_${user.id}_${Date.now()}`;
        const response = {
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
    }
    catch (error) {
        console.error('Registration error:', error);
        const response = {
            success: false,
            message: 'Failed to create account'
        };
        res.status(500).json(response);
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await database_1.default.query('SELECT id, email, password_hash, first_name, last_name, avatar, created_at FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            const response = {
                success: false,
                message: 'Invalid credentials'
            };
            res.status(401).json(response);
            return;
        }
        const user = userResult.rows[0];
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isValidPassword) {
            const response = {
                success: false,
                message: 'Invalid credentials'
            };
            res.status(401).json(response);
            return;
        }
        const profileResult = await database_1.default.query('SELECT phone, skills, experience, education, summary, resume_filename, resume_upload_date FROM user_profiles WHERE user_id = $1', [user.id]);
        const profile = profileResult.rows[0] || null;
        const payload = {
            userId: user.id,
            email: user.email
        };
        const token = `temp_token_${user.id}_${Date.now()}`;
        const response = {
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
    }
    catch (error) {
        console.error('Login error:', error);
        const response = {
            success: false,
            message: 'Login failed'
        };
        res.status(500).json(response);
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userResult = await database_1.default.query('SELECT id, email, first_name, last_name, avatar, created_at FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            const response = {
                success: false,
                message: 'User not found'
            };
            res.status(404).json(response);
            return;
        }
        const user = userResult.rows[0];
        const profileResult = await database_1.default.query('SELECT phone, skills, experience, education, summary, resume_filename, resume_upload_date FROM user_profiles WHERE user_id = $1', [userId]);
        const profile = profileResult.rows[0] || null;
        const response = {
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        const response = {
            success: false,
            message: 'Failed to get profile'
        };
        res.status(500).json(response);
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { phone, skills, experience, education, summary } = req.body;
        await database_1.default.query(`UPDATE user_profiles 
       SET phone = $1, skills = $2, experience = $3, education = $4, summary = $5, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $6`, [phone, skills, experience, education, summary, userId]);
        const response = {
            success: true,
            data: { message: 'Profile updated successfully' }
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Update profile error:', error);
        const response = {
            success: false,
            message: 'Failed to update profile'
        };
        res.status(500).json(response);
    }
};
exports.updateProfile = updateProfile;
const updateProfileFromResume = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { fullName, email, phone, skills, experience, education, summary, resumeFileName } = req.body;
        if (fullName) {
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');
            await database_1.default.query('UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3', [firstName, lastName, userId]);
        }
        await database_1.default.query(`UPDATE user_profiles 
       SET phone = COALESCE($1, phone), 
           skills = COALESCE($2, skills), 
           experience = COALESCE($3, experience), 
           education = COALESCE($4, education), 
           summary = COALESCE($5, summary),
           resume_filename = $6,
           resume_upload_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $7`, [phone, skills, experience, education, summary, resumeFileName, userId]);
        const response = {
            success: true,
            data: { message: 'Profile updated from resume successfully' }
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Update profile from resume error:', error);
        const response = {
            success: false,
            message: 'Failed to update profile from resume'
        };
        res.status(500).json(response);
    }
};
exports.updateProfileFromResume = updateProfileFromResume;
