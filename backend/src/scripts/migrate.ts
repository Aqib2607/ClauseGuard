import { AppDataSource } from '../config/database';
import { logger } from '../config/logger';

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    logger.info('Running database migrations...');
    
    await AppDataSource.runMigrations();
    
    logger.info('✅ Migrations completed successfully');
    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
