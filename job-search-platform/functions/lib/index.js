"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
// Create Express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
// JWT Secret - In production, use Firebase Functions config
const JWT_SECRET = ((_a = functions.config().jwt) === null || _a === void 0 ? void 0 : _a.secret) || 'your-secret-key-change-in-production';
// ============ AUTH ROUTES ============
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        // Check if user exists
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user in Firestore
        const userId = db.collection('users').doc().id;
        await db.collection('users').doc(userId).set({
            id: userId,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            data: {
                user: { id: userId, email, firstName, lastName },
                token
            }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        const userSnapshot = await db.collection('users').where('email', '==', email).get();
        if (userSnapshot.empty) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const userData = userSnapshot.docs[0].data();
        // Verify password
        const validPassword = await bcryptjs_1.default.compare(password, userData.password);
        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: userData.id, email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            data: {
                user: {
                    id: userData.id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName
                },
                token
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});
// ============ JOBS ROUTES ============
app.get('/api/jobs', async (req, res) => {
    try {
        const { limit = 50, search, location, type, company } = req.query;
        let query = db.collection('jobs').orderBy('postedDate', 'desc');
        if (company) {
            query = query.where('company', '==', company);
        }
        if (location) {
            query = query.where('location', '==', location);
        }
        if (type) {
            query = query.where('type', '==', type);
        }
        const snapshot = await query.limit(Number(limit)).get();
        const jobs = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        // If search query, filter in memory (Firestore doesn't support text search)
        let filteredJobs = jobs;
        if (search) {
            const searchLower = String(search).toLowerCase();
            filteredJobs = jobs.filter((job) => {
                var _a, _b, _c;
                return ((_a = job.title) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchLower)) ||
                    ((_b = job.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(searchLower)) ||
                    ((_c = job.company) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(searchLower));
            });
        }
        res.json({
            success: true,
            data: {
                data: filteredJobs,
                total: filteredJobs.length,
                page: 1,
                totalPages: 1
            }
        });
    }
    catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
    }
});
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const doc = await db.collection('jobs').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }
        res.json({
            success: true,
            data: Object.assign({ id: doc.id }, doc.data())
        });
    }
    catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch job' });
    }
});
// ============ APPLICATIONS ROUTES ============
app.post('/api/applications', async (req, res) => {
    try {
        const { jobId, coverLetter, resumeFilename } = req.body;
        const decoded = req.headers.authorization ? jsonwebtoken_1.default.decode(req.headers.authorization.replace('Bearer ', '')) : null;
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const applicationId = db.collection('applications').doc().id;
        const application = {
            id: applicationId,
            jobId,
            userId: decoded === null || decoded === void 0 ? void 0 : decoded.userId,
            coverLetter,
            resumeFilename,
            status: 'pending',
            appliedDate: admin.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('applications').doc(applicationId).set(application);
        res.json({
            success: true,
            data: {
                id: applicationId,
                appliedDate: new Date().toISOString()
            }
        });
    }
    catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ success: false, message: 'Failed to submit application' });
    }
});
app.get('/api/applications', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const snapshot = await db.collection('applications')
            .where('userId', '==', decoded.userId)
            .orderBy('appliedDate', 'desc')
            .get();
        const applications = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
        res.json({
            success: true,
            data: applications
        });
    }
    catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch applications' });
    }
});
// ============ SAVED JOBS ROUTES ============
app.post('/api/jobs/save', async (req, res) => {
    try {
        const { jobId } = req.body;
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const savedJobId = db.collection('savedJobs').doc().id;
        await db.collection('savedJobs').doc(savedJobId).set({
            id: savedJobId,
            userId: decoded.userId,
            jobId,
            savedDate: admin.firestore.FieldValue.serverTimestamp()
        });
        res.json({
            success: true,
            data: { message: 'Job saved successfully' }
        });
    }
    catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({ success: false, message: 'Failed to save job' });
    }
});
app.get('/api/jobs/saved', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Get saved job IDs
        const savedSnapshot = await db.collection('savedJobs')
            .where('userId', '==', decoded.userId)
            .get();
        const jobIds = savedSnapshot.docs.map(doc => doc.data().jobId);
        if (jobIds.length === 0) {
            return res.json({ success: true, data: [] });
        }
        // Get actual job data
        const jobs = await Promise.all(jobIds.map(async (jobId) => {
            const jobDoc = await db.collection('jobs').doc(jobId).get();
            return jobDoc.exists ? Object.assign({ id: jobDoc.id }, jobDoc.data()) : null;
        }));
        res.json({
            success: true,
            data: jobs.filter(job => job !== null)
        });
    }
    catch (error) {
        console.error('Error fetching saved jobs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch saved jobs' });
    }
});
// ============ PROFILE ROUTES ============
app.get('/api/auth/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userDoc = await db.collection('users').doc(decoded.userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const userData = userDoc.data();
        userData === null || userData === void 0 ? true : delete userData.password; // Remove password from response
        res.json({
            success: true,
            data: userData
        });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
});
// Export the Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
// Optional: Add a function to seed initial data
exports.seedData = functions.https.onRequest(async (req, res) => {
    try {
        // Add sample jobs
        const jobs = [
            {
                title: "Senior Software Engineer",
                company: "TechCorp",
                location: "San Francisco, CA",
                type: "Full-time",
                remote: true,
                description: "We are looking for a Senior Software Engineer...",
                requirements: ["5+ years experience", "React", "Node.js"],
                salary: { min: 120000, max: 180000, currency: "USD" },
                department: "Engineering",
                postedDate: new Date().toISOString()
            },
            // Add more sample jobs as needed
        ];
        const batch = db.batch();
        jobs.forEach(job => {
            const docRef = db.collection('jobs').doc();
            batch.set(docRef, Object.assign(Object.assign({}, job), { id: docRef.id }));
        });
        await batch.commit();
        res.json({ success: true, message: 'Sample data seeded successfully' });
    }
    catch (error) {
        console.error('Error seeding data:', error);
        res.status(500).json({ success: false, message: 'Failed to seed data' });
    }
});
//# sourceMappingURL=index.js.map