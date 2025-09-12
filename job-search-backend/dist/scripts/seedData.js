"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAll = exports.seedJobs = exports.seedUsers = void 0;
const database_1 = __importDefault(require("../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const jobs = [
    {
        id: '1',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Solutions',
        companyLogo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face&auto=format',
        department: 'Software',
        location: 'San Francisco, CA',
        type: 'Full-time',
        remote: false,
        description: 'Join our dynamic team as a Senior Full Stack Developer and lead the development of cutting-edge web applications. You will work with modern technologies including React, Node.js, and cloud platforms to deliver exceptional user experiences.',
        requirements: [
            '5+ years of experience in full-stack development',
            'Proficiency in React, Node.js, and TypeScript',
            'Experience with cloud platforms (AWS, Azure, or GCP)',
            'Strong knowledge of database systems (SQL and NoSQL)',
            'Experience with containerization and CI/CD pipelines',
            'Excellent problem-solving and communication skills'
        ],
        benefits: [
            'Competitive salary and equity package',
            'Comprehensive health, dental, and vision insurance',
            'Flexible work arrangements and remote options',
            '401(k) with company matching',
            'Professional development budget',
            'Unlimited PTO policy'
        ],
        salaryMin: 120000,
        salaryMax: 160000,
        postedDate: '2025-08-30'
    },
    {
        id: '2',
        title: 'Registered Nurse - ICU',
        company: 'Metropolitan Hospital',
        companyLogo: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Healthcare',
        location: 'New York, NY',
        type: 'Full-time',
        remote: false,
        description: 'We are seeking a compassionate and skilled Registered Nurse to join our Intensive Care Unit team. The ideal candidate will provide high-quality patient care in a fast-paced, critical care environment.',
        requirements: [
            'Current RN license in New York State',
            'BSN preferred, ASN required',
            'Minimum 2 years ICU experience',
            'BLS and ACLS certification required',
            'Strong critical thinking and assessment skills',
            'Excellent communication and teamwork abilities'
        ],
        benefits: [
            'Competitive salary with shift differentials',
            'Comprehensive benefits package',
            'Tuition reimbursement program',
            'Flexible scheduling options',
            'Career advancement opportunities',
            'Employee wellness programs'
        ],
        salaryMin: 75000,
        salaryMax: 95000,
        postedDate: '2025-08-28'
    },
    {
        id: '3',
        title: 'DevOps Engineer',
        company: 'CloudScale Inc',
        companyLogo: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Software',
        location: 'Austin, TX',
        type: 'Full-time',
        remote: true,
        description: 'Join our DevOps team to build and maintain scalable infrastructure solutions. You will work with containerization, orchestration, and cloud technologies to ensure reliable and efficient deployment pipelines.',
        requirements: [
            '3+ years of DevOps or Site Reliability Engineering experience',
            'Proficiency with Docker, Kubernetes, and cloud platforms',
            'Experience with infrastructure as code (Terraform, CloudFormation)',
            'Strong scripting skills (Python, Bash, or similar)',
            'Knowledge of monitoring and logging tools',
            'Experience with CI/CD pipeline development'
        ],
        benefits: [
            'Fully remote work environment',
            'Competitive salary and stock options',
            'Health, dental, and vision coverage',
            'Home office setup allowance',
            'Professional conference attendance',
            'Flexible working hours'
        ],
        salaryMin: 100000,
        salaryMax: 130000,
        postedDate: '2025-08-26'
    },
    {
        id: '4',
        title: 'Quality Assurance Specialist',
        company: 'PharmaLab Industries',
        companyLogo: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Healthcare',
        location: 'Boston, MA',
        type: 'Full-time',
        remote: false,
        description: 'Ensure the highest quality standards for pharmaceutical products by conducting comprehensive quality assurance testing and maintaining compliance with regulatory requirements.',
        requirements: [
            'Bachelor\'s degree in Chemistry, Biology, or related field',
            '3+ years of QA experience in pharmaceutical industry',
            'Knowledge of FDA regulations and GMP standards',
            'Experience with analytical testing methods',
            'Strong attention to detail and documentation skills',
            'Ability to work in a regulated laboratory environment'
        ],
        benefits: [
            'Competitive salary with annual bonuses',
            'Comprehensive health and retirement benefits',
            'Professional development opportunities',
            'On-site fitness center and cafeteria',
            'Employee stock purchase program',
            'Paid volunteer time off'
        ],
        salaryMin: 65000,
        salaryMax: 85000,
        postedDate: '2025-08-24'
    },
    {
        id: '5',
        title: 'Backend Software Engineer',
        company: 'DataFlow Systems',
        companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Software',
        location: 'Seattle, WA',
        type: 'Full-time',
        remote: false,
        description: 'Design and develop robust backend systems that power our data analytics platform. Work with large-scale distributed systems and contribute to architectural decisions.',
        requirements: [
            '4+ years of backend development experience',
            'Proficiency in Java, Python, or Go',
            'Experience with microservices architecture',
            'Strong database design and optimization skills',
            'Knowledge of message queues and distributed systems',
            'Experience with API design and development'
        ],
        benefits: [
            'Competitive compensation package',
            'Comprehensive health benefits',
            'Flexible PTO and sabbatical options',
            'Stock options and 401(k) matching',
            'Learning and development stipend',
            'Collaborative and innovative work environment'
        ],
        salaryMin: 110000,
        salaryMax: 140000,
        postedDate: '2025-08-22'
    },
    {
        id: '6',
        title: 'Manufacturing Engineer',
        company: 'Precision Manufacturing Co',
        companyLogo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Manufacturing',
        location: 'Detroit, MI',
        type: 'Full-time',
        remote: false,
        description: 'Lead manufacturing process improvements and optimization initiatives. Design and implement efficient production systems while ensuring quality and safety standards.',
        requirements: [
            'Bachelor\'s degree in Manufacturing or Mechanical Engineering',
            '3+ years of manufacturing engineering experience',
            'Knowledge of lean manufacturing principles',
            'Experience with CAD software and process simulation tools',
            'Strong analytical and problem-solving skills',
            'Project management experience preferred'
        ],
        benefits: [
            'Competitive salary and performance bonuses',
            'Full health, dental, and vision coverage',
            'Retirement plan with company matching',
            'Professional development and training programs',
            'Employee referral bonus program',
            'On-site parking and cafeteria'
        ],
        salaryMin: 70000,
        salaryMax: 90000,
        postedDate: '2025-08-20'
    },
    {
        id: '7',
        title: 'Clinical Research Coordinator',
        company: 'Advanced Medical Research',
        companyLogo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Healthcare',
        location: 'Houston, TX',
        type: 'Full-time',
        remote: false,
        description: 'Coordinate and manage clinical research studies ensuring compliance with protocol requirements and regulatory standards. Support principal investigators and research teams.',
        requirements: [
            'Bachelor\'s degree in life sciences or related field',
            '2+ years of clinical research experience',
            'Knowledge of GCP, FDA regulations, and ICH guidelines',
            'Strong organizational and communication skills',
            'Experience with clinical trial management systems',
            'ACRP certification preferred'
        ],
        benefits: [
            'Competitive salary with annual increases',
            'Comprehensive benefits package',
            'Continuing education support',
            'Flexible work schedule options',
            'Research conference attendance opportunities',
            'Career advancement pathways'
        ],
        salaryMin: 55000,
        salaryMax: 70000,
        postedDate: '2025-08-18'
    },
    {
        id: '8',
        title: 'Frontend Developer',
        company: 'Creative Digital Agency',
        companyLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Software',
        location: 'Los Angeles, CA',
        type: 'Contract',
        remote: true,
        description: 'Create stunning and responsive user interfaces for web applications. Collaborate with design teams to implement pixel-perfect designs with modern frontend technologies.',
        requirements: [
            '3+ years of frontend development experience',
            'Expert knowledge of React, Vue.js, or Angular',
            'Proficiency in HTML5, CSS3, and JavaScript/TypeScript',
            'Experience with responsive design and cross-browser compatibility',
            'Knowledge of build tools and version control systems',
            'Strong eye for design and user experience'
        ],
        benefits: [
            'Competitive hourly rate',
            'Remote work flexibility',
            'Project-based bonuses',
            'Access to latest design tools and software',
            'Opportunity to work with diverse clients',
            'Potential for full-time conversion'
        ],
        salaryMin: 80000,
        salaryMax: 100000,
        postedDate: '2025-08-16'
    },
    {
        id: '9',
        title: 'Production Supervisor',
        company: 'Industrial Solutions Ltd',
        companyLogo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Manufacturing',
        location: 'Chicago, IL',
        type: 'Full-time',
        remote: false,
        description: 'Supervise daily production operations and lead a team of production workers. Ensure production goals are met while maintaining safety and quality standards.',
        requirements: [
            '5+ years of manufacturing experience',
            '2+ years in supervisory or leadership role',
            'Knowledge of production planning and scheduling',
            'Experience with safety regulations and compliance',
            'Strong leadership and communication skills',
            'Ability to work in a fast-paced environment'
        ],
        benefits: [
            'Competitive salary with overtime pay',
            'Health and dental insurance',
            'Retirement savings plan',
            'Paid vacation and sick leave',
            'Safety bonuses and recognition programs',
            'Opportunities for advancement'
        ],
        salaryMin: 65000,
        salaryMax: 80000,
        postedDate: '2025-08-14'
    },
    {
        id: '10',
        title: 'Medical Assistant',
        company: 'Family Care Clinic',
        companyLogo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=center&auto=format',
        department: 'Healthcare',
        location: 'Phoenix, AZ',
        type: 'Part-time',
        remote: false,
        description: 'Support healthcare providers by performing administrative and clinical tasks in a busy family practice. Provide excellent patient care and maintain accurate medical records.',
        requirements: [
            'Medical Assistant certification or equivalent training',
            '1+ years of experience in clinical setting',
            'Knowledge of medical terminology and procedures',
            'Proficiency with electronic health record systems',
            'Excellent patient communication skills',
            'Ability to multitask in a fast-paced environment'
        ],
        benefits: [
            'Hourly wage with performance incentives',
            'Health insurance options',
            'Flexible part-time schedule',
            'Continuing education opportunities',
            'Employee assistance program',
            'Positive and supportive work environment'
        ],
        salaryMin: 35000,
        salaryMax: 45000,
        postedDate: '2025-08-12'
    }
];
const demoUsers = [
    {
        email: 'john.doe@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format'
    },
    {
        email: 'jane.smith@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2e10e9d?w=150&h=150&fit=crop&crop=face&auto=format'
    },
    {
        email: 'mike.johnson@example.com',
        password: 'password123',
        firstName: 'Mike',
        lastName: 'Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
    }
];
const seedUsers = async () => {
    const client = await database_1.default.connect();
    try {
        console.log('👥 Starting to seed user data...');
        await client.query('DELETE FROM applications');
        await client.query('DELETE FROM saved_jobs');
        await client.query('DELETE FROM user_profiles');
        await client.query('DELETE FROM users');
        console.log('🗑️ Cleared existing user data');
        const saltRounds = 12;
        for (const user of demoUsers) {
            const passwordHash = await bcryptjs_1.default.hash(user.password, saltRounds);
            const userResult = await client.query(`INSERT INTO users (email, password_hash, first_name, last_name, avatar) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id`, [user.email, passwordHash, user.firstName, user.lastName, user.avatar]);
            const userId = userResult.rows[0].id;
            await client.query('INSERT INTO user_profiles (user_id) VALUES ($1)', [userId]);
            console.log(`✅ Created user: ${user.email}`);
        }
        console.log(`✅ Successfully seeded ${demoUsers.length} users`);
    }
    catch (error) {
        console.error('❌ Error seeding user data:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.seedUsers = seedUsers;
const seedJobs = async () => {
    const client = await database_1.default.connect();
    try {
        console.log('🌱 Starting to seed job data...');
        await client.query('DELETE FROM applications');
        await client.query('DELETE FROM saved_jobs');
        await client.query('DELETE FROM jobs');
        console.log('🗑️ Cleared existing job data');
        for (const job of jobs) {
            const jobId = (0, crypto_1.randomUUID)();
            await client.query(`INSERT INTO jobs (
          id, title, company, company_logo, department, location, type, remote,
          description, requirements, benefits, salary_min, salary_max, posted_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, [
                jobId,
                job.title,
                job.company,
                job.companyLogo,
                job.department,
                job.location,
                job.type,
                job.remote,
                job.description,
                job.requirements,
                job.benefits,
                job.salaryMin,
                job.salaryMax,
                job.postedDate
            ]);
        }
        console.log(`✅ Successfully seeded ${jobs.length} jobs`);
    }
    catch (error) {
        console.error('❌ Error seeding job data:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.seedJobs = seedJobs;
const seedAll = async () => {
    try {
        console.log('🌱 Starting complete database seeding...');
        await (0, exports.seedUsers)();
        await (0, exports.seedJobs)();
        console.log('🎉 Complete seeding finished successfully!');
    }
    catch (error) {
        console.error('💥 Complete seeding failed:', error);
        throw error;
    }
};
exports.seedAll = seedAll;
if (require.main === module) {
    (0, exports.seedAll)()
        .then(() => {
        console.log('🎉 Seeding completed successfully!');
        process.exit(0);
    })
        .catch((error) => {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    });
}
