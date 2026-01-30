import { DataSource } from 'typeorm';
import { config, isDevelopment } from './index';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { Course } from '../entities/course.entity';
import { Class } from '../entities/class.entity';
import { ClassStudent } from '../entities/class-student.entity';
import { Lesson } from '../entities/lesson.entity';
import { LessonDetail } from '../entities/lesson-detail.entity';
import { ExerciseSection } from '../entities/exercise-section.entity';
import { Question } from '../entities/question.entity';
import { CommonList } from '../modules/common-list/common-list.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: config.databaseUrl,
  synchronize: false, // Don't auto sync - use migrations
  logging: isDevelopment(),
  entities: [User, Role, Permission, Course, Class, ClassStudent, Lesson, LessonDetail, ExerciseSection, Question, CommonList],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false, // Required for Supabase
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL (Supabase) connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};
