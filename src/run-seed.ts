import 'reflect-metadata';
import { AppDataSource, connectDatabase } from './config/database';
import { seedDefaultData } from './seeds/seed';

const runSeed = async (): Promise<void> => {
  try {
    console.log('Connecting to database...');
    await connectDatabase();
    
    console.log('Running seeds...');
    await seedDefaultData();
    
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

runSeed();
