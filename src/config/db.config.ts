/* eslint-disable no-console */
import mongoose from 'mongoose';

const uri = process.env.DATABASE_URI;

export const dbConnect = async (): Promise<void> => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(uri!);
    console.log('Database connected!');
  } catch (error) {
    console.log('Database connection failed.');
    console.log('Error:', error);
    process.exit(1);
  }
};
