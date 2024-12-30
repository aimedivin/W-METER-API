import 'dotenv/config';
import { dbConnect } from '../config/db.config';
import logger from '../utils/logger';
import seedRoles from './role.seeder';

const seedDatabase = async () => {
  try {
    await dbConnect();

    logger.info('Starting database seeding...');
    // inserting seed data for role
    await seedRoles();
    process.exit(1);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};
void seedDatabase();
