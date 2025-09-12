"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const jobsController_1 = require("../controllers/jobsController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
const getJobsValidation = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('salaryMin').optional().isInt({ min: 0 }).withMessage('Salary min must be a positive number'),
    (0, express_validator_1.query)('salaryMax').optional().isInt({ min: 0 }).withMessage('Salary max must be a positive number'),
    (0, express_validator_1.query)('remote').optional().isBoolean().withMessage('Remote must be a boolean'),
    (0, express_validator_1.query)('postedWithin').optional().isInt({ min: 1 }).withMessage('Posted within must be a positive number'),
];
router.get('/', getJobsValidation, validate_1.validate, jobsController_1.getJobs);
router.get('/saved', auth_1.authenticate, jobsController_1.getSavedJobs);
router.get('/:id', jobsController_1.getJobById);
router.post('/save', auth_1.authenticate, jobsController_1.saveJob);
router.delete('/save/:jobId', auth_1.authenticate, jobsController_1.unsaveJob);
exports.default = router;
