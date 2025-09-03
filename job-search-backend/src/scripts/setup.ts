import { createTables } from './migrate';
import { seedAll } from './seedData';
import pool from '../config/database';

const setup = async () => {
  try {
    console.log('🚀 Starting database setup...');
    
    // Run migrations
    await createTables();
    
    // Seed data (users and jobs)
    await seedAll();
    
    console.log('🎉 Database setup completed successfully!');
  } catch (error) {
    console.error('💥 Database setup failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

if (require.main === module) {
  setup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { setup };