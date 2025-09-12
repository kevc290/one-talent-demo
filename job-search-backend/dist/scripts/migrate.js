"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = void 0;
const database_1 = __importDefault(require("../config/database"));
const createTables = async () => {
    const client = await database_1.default.connect();
    try {
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        phone VARCHAR(20),
        skills TEXT[], 
        experience TEXT[],
        education TEXT[],
        summary TEXT,
        resume_filename VARCHAR(255),
        resume_upload_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await client.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) UNIQUE NOT NULL,
        industry VARCHAR(100),
        size VARCHAR(50),
        founded INTEGER,
        website TEXT,
        description TEXT,
        logo TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        company_logo TEXT,
        department VARCHAR(100),
        location VARCHAR(255),
        type VARCHAR(20) CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Internship')),
        remote BOOLEAN DEFAULT FALSE,
        description TEXT NOT NULL,
        requirements TEXT[] NOT NULL,
        benefits TEXT[],
        salary_min INTEGER,
        salary_max INTEGER,
        posted_date DATE DEFAULT CURRENT_DATE,
        expires_date DATE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'rejected', 'accepted')),
        applied_date DATE DEFAULT CURRENT_DATE,
        cover_letter TEXT,
        resume_filename VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, job_id)
      )
    `);
        await client.query(`
      CREATE TABLE IF NOT EXISTS saved_jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
        saved_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, job_id)
      )
    `);
        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
      CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
      CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
      CREATE INDEX IF NOT EXISTS idx_jobs_remote ON jobs(remote);
      CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
      CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON jobs(posted_date);
      CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
      CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
    `);
        await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);
        const tables = ['users', 'user_profiles', 'companies', 'jobs', 'applications'];
        for (const table of tables) {
            await client.query(`
        DROP TRIGGER IF EXISTS update_${table}_updated_at ON ${table};
        CREATE TRIGGER update_${table}_updated_at
          BEFORE UPDATE ON ${table}
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
        }
        console.log('✅ Database tables created successfully!');
    }
    catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
    finally {
        client.release();
    }
};
exports.createTables = createTables;
const main = async () => {
    try {
        await createTables();
        console.log('🎉 Migration completed successfully!');
    }
    catch (error) {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    }
    finally {
        await database_1.default.end();
    }
};
if (require.main === module) {
    main();
}
