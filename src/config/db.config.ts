import mongoose, { MongooseError } from 'mongoose';
import logger from '../utils/logger';

const uri = process.env.DATABASE_URI;

export const dbConnect = async (): Promise<void> => {
  try {
    logger.info('Connecting to database...');
    await mongoose.connect(uri!);
    logger.info('Database connected!');
  } catch (error) {
    const err = error as MongooseError;
    logger.error('Database connection failed.');
    logger.error(`${err.name}: ${err.message}`);
    process.exit(1);
  }
};
