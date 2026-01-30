import { AppDataSource } from '../config/database';
import { CommonList } from '../modules/common-list/common-list.entity';
import { CommonListType } from '../modules/common-list/common-list.entity';

/**
 * Seed data for common_lists table
 * This includes: LEVEL, KIND_OF_COURSE, ROLE
 */
async function seedCommonLists() {
  const commonListRepository = AppDataSource.getRepository(CommonList);

  // Check if data already exists
  const existingData = await commonListRepository.count();
  if (existingData > 0) {
    console.log(' CommonList data already exists. Skipping seed...');
    return;
  }

  const commonListsData = [
    // LEVELS
    { type: CommonListType.LEVEL, code: 'S', name: 'Starter', description: 'Trình độ khởi đầu', order: 1 },
    { type: CommonListType.LEVEL, code: 'PRES', name: 'Pre-Starter', description: 'Trình độ tiền khởi đầu', order: 2 },
    { type: CommonListType.LEVEL, code: 'TC', name: 'TC', description: 'Trình độ TC', order: 3 },
    { type: CommonListType.LEVEL, code: 'MTC', name: 'MTC', description: 'Trình độ MTC', order: 4 },
    { type: CommonListType.LEVEL, code: 'FI', name: 'Foundation I', description: 'Nền tảng 1', order: 5 },
    { type: CommonListType.LEVEL, code: 'EF', name: 'Elementary Foundation', description: 'Nền tảng sơ cấp', order: 6 },
    { type: CommonListType.LEVEL, code: 'TE', name: 'TE', description: 'Trình độ TE', order: 7 },
    { type: CommonListType.LEVEL, code: 'ME', name: 'ME', description: 'Trình độ ME', order: 8 },

    // KIND OF COURSE
    { type: CommonListType.KIND_OF_COURSE, code: 'IELTS', name: 'IELTS', description: 'International English Language Testing System', order: 1 },
    { type: CommonListType.KIND_OF_COURSE, code: 'TOEIC', name: 'TOEIC', description: 'Test of English for International Communication', order: 2 },
    { type: CommonListType.KIND_OF_COURSE, code: '4SKILL', name: '4 Skills', description: 'Khóa học 4 kỹ năng', order: 3 },

    // ROLES
    { type: CommonListType.ROLE, code: 'ADMIN', name: 'Administrator', description: 'Quản trị viên hệ thống', order: 1 },
    { type: CommonListType.ROLE, code: 'TEACHER', name: 'Teacher', description: 'Giáo viên', order: 2 },
    { type: CommonListType.ROLE, code: 'STUDENT', name: 'Student', description: 'Học sinh', order: 3 },
  ];

  try {
    const entities = commonListRepository.create(commonListsData);
    await commonListRepository.save(entities);
    console.log(' CommonList data seeded successfully!');
    console.log(`   - ${entities.length} records created`);
  } catch (error) {
    console.error(' Error seeding CommonList data:', error);
    throw error;
  }
}

/**
 * Main seed function
 */
async function seed() {
  try {
    console.log(' Starting database seeding...\n');

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log(' Database connected\n');
    }

    // Run seeds
    await seedCommonLists();

    console.log('\n All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n Seeding failed:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed();
}

export { seed, seedCommonLists };
