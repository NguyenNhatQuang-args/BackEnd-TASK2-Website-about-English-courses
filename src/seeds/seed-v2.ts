import { AppDataSource } from '../config/database';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';
import { Class } from '../entities/class.entity';
import { ClassStudent } from '../entities/class-student.entity';
import { Lesson } from '../entities/lesson.entity';
import { ExerciseSection } from '../entities/exercise-section.entity';
import { Question } from '../entities/question.entity';
import {
  UserRole,
  Status,
  CourseLevel,
  CourseKind,
  ExerciseSectionType,
  QuestionType,
  DifficultyLevel,
} from '../entities/enums';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    // Clear existing data
    await AppDataSource.query('TRUNCATE TABLE questions CASCADE');
    await AppDataSource.query('TRUNCATE TABLE exercise_sections CASCADE');
    await AppDataSource.query('TRUNCATE TABLE lesson_details CASCADE');
    await AppDataSource.query('TRUNCATE TABLE lessons CASCADE');
    await AppDataSource.query('TRUNCATE TABLE class_students CASCADE');
    await AppDataSource.query('TRUNCATE TABLE classes CASCADE');
    await AppDataSource.query('TRUNCATE TABLE courses CASCADE');
    await AppDataSource.query('TRUNCATE TABLE users CASCADE');
    await AppDataSource.query('TRUNCATE TABLE roles CASCADE');
    await AppDataSource.query('TRUNCATE TABLE permissions CASCADE');

    const permissionRepo = AppDataSource.getRepository(Permission);
    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);
    const courseRepo = AppDataSource.getRepository(Course);
    const classRepo = AppDataSource.getRepository(Class);
    const classStudentRepo = AppDataSource.getRepository(ClassStudent);
    const lessonRepo = AppDataSource.getRepository(Lesson);
    const sectionRepo = AppDataSource.getRepository(ExerciseSection);
    const questionRepo = AppDataSource.getRepository(Question);

    // ==================== PERMISSIONS ====================
    console.log('Seeding permissions...');
    const permissionsData = [
      // User Management
      { code: 'CREATE_USER', name: 'Tạo người dùng', roles: [UserRole.ADMIN] },
      { code: 'READ_USER', name: 'Xem người dùng', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'UPDATE_USER', name: 'Cập nhật người dùng', roles: [UserRole.ADMIN] },
      { code: 'DELETE_USER', name: 'Xóa người dùng', roles: [UserRole.ADMIN] },
      // Role Management
      { code: 'MANAGE_ROLES', name: 'Quản lý vai trò', roles: [UserRole.ADMIN] },
      // Permission Management
      { code: 'MANAGE_PERMISSIONS', name: 'Quản lý quyền', roles: [UserRole.ADMIN] },
      // Course Management
      { code: 'CREATE_COURSE', name: 'Tạo khóa học', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'READ_COURSE', name: 'Xem khóa học', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
      { code: 'UPDATE_COURSE', name: 'Cập nhật khóa học', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'DELETE_COURSE', name: 'Xóa khóa học', roles: [UserRole.ADMIN] },
      // Class Management
      { code: 'CREATE_CLASS', name: 'Tạo lớp học', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'READ_CLASS', name: 'Xem lớp học', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
      { code: 'UPDATE_CLASS', name: 'Cập nhật lớp học', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'DELETE_CLASS', name: 'Xóa lớp học', roles: [UserRole.ADMIN] },
      { code: 'MANAGE_STUDENTS', name: 'Quản lý học sinh trong lớp', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      // Lesson Management
      { code: 'CREATE_LESSON', name: 'Tạo bài học', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'READ_LESSON', name: 'Xem bài học', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
      { code: 'UPDATE_LESSON', name: 'Cập nhật bài học', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'DELETE_LESSON', name: 'Xóa bài học', roles: [UserRole.ADMIN] },
      // Exercise Management
      { code: 'CREATE_EXERCISE', name: 'Tạo bài tập', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'READ_EXERCISE', name: 'Xem bài tập', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
      { code: 'UPDATE_EXERCISE', name: 'Cập nhật bài tập', roles: [UserRole.ADMIN, UserRole.TEACHER] },
      { code: 'DELETE_EXERCISE', name: 'Xóa bài tập', roles: [UserRole.ADMIN] },
      // Profile
      { code: 'VIEW_PROFILE', name: 'Xem hồ sơ cá nhân', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
      { code: 'UPDATE_PROFILE', name: 'Cập nhật hồ sơ', roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT] },
    ];

    const permissions: Permission[] = [];
    for (const p of permissionsData) {
      const permission = permissionRepo.create({
        code: p.code,
        name: p.name,
        description: `Quyền ${p.name.toLowerCase()}`,
        roles: p.roles.join(','),
        isActive: true,
      });
      permissions.push(await permissionRepo.save(permission));
    }
    console.log(`Created ${permissions.length} permissions`);

    // ==================== ROLES ====================
    console.log('Seeding roles...');
    const rolesData = [
      {
        name: UserRole.ADMIN,
        description: 'Quản trị viên - Full quyền',
        permissions: permissions.map(p => p.code).join(','),
      },
      {
        name: UserRole.TEACHER,
        description: 'Giáo viên - Quản lý khóa học và lớp học',
        permissions: permissions
          .filter(p => p.hasRole(UserRole.TEACHER))
          .map(p => p.code)
          .join(','),
      },
      {
        name: UserRole.STUDENT,
        description: 'Học sinh - Xem và học',
        permissions: permissions
          .filter(p => p.hasRole(UserRole.STUDENT))
          .map(p => p.code)
          .join(','),
      },
    ];

    const roles: Role[] = [];
    for (const r of rolesData) {
      const role = roleRepo.create(r);
      roles.push(await roleRepo.save(role));
    }
    console.log(`Created ${roles.length} roles`);

    // ==================== USERS ====================
    console.log('Seeding users...');
    const usersData = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin@123',
        fullname: 'System Admin',
        phone: '0901234567',
        role: UserRole.ADMIN,
        status: Status.ACTIVE,
      },
      {
        username: 'teacher1',
        email: 'teacher1@example.com',
        password: 'Admin@123',
        fullname: 'Nguyen Van Teacher',
        phone: '0901234568',
        role: UserRole.TEACHER,
        status: Status.ACTIVE,
      },
      {
        username: 'teacher2',
        email: 'teacher2@example.com',
        password: 'Admin@123',
        fullname: 'Tran Thi Teacher',
        phone: '0901234569',
        role: UserRole.TEACHER,
        status: Status.ACTIVE,
      },
      {
        username: 'student1',
        email: 'student1@example.com',
        password: 'Student@123',
        fullname: 'Nguyen Van A',
        phone: '0901234570',
        role: UserRole.STUDENT,
        status: Status.ACTIVE,
      },
      {
        username: 'student2',
        email: 'student2@example.com',
        password: 'Student@123',
        fullname: 'Tran Thi B',
        phone: '0901234571',
        role: UserRole.STUDENT,
        status: Status.ACTIVE,
      },
      {
        username: 'student3',
        email: 'student3@example.com',
        password: 'Student@123',
        fullname: 'Le Van C',
        phone: '0901234572',
        role: UserRole.STUDENT,
        status: Status.ACTIVE,
      },
    ];

    const users: User[] = [];
    for (const u of usersData) {
      const user = userRepo.create(u);
      users.push(await userRepo.save(user));
    }
    console.log(`Created ${users.length} users`);

    const admin = users.find(u => u.role === UserRole.ADMIN)!;
    const teacher1 = users.find(u => u.username === 'teacher1')!;
    const teacher2 = users.find(u => u.username === 'teacher2')!;
    const students = users.filter(u => u.role === UserRole.STUDENT);

    // ==================== COURSES ====================
    console.log('Seeding courses...');
    const coursesData = [
      { title: 'IELTS Starter', description: 'Khóa học IELTS cho người mới bắt đầu', level: CourseLevel.S, kind: CourseKind.IELTS },
      { title: 'IELTS Foundation', description: 'Khóa học IELTS nền tảng', level: CourseLevel.FI, kind: CourseKind.IELTS },
      { title: 'IELTS Pre-Intermediate', description: 'Khóa học IELTS tiền trung cấp', level: CourseLevel.PRES, kind: CourseKind.IELTS },
      { title: 'TOEIC Basic', description: 'Khóa học TOEIC cơ bản', level: CourseLevel.TC, kind: CourseKind.TOEIC },
      { title: 'TOEIC Intermediate', description: 'Khóa học TOEIC trung cấp', level: CourseLevel.MTC, kind: CourseKind.TOEIC },
      { title: '4 Skills Elementary', description: 'Khóa học 4 kỹ năng cơ bản', level: CourseLevel.EF, kind: CourseKind.SKILL_4 },
    ];

    const courses: Course[] = [];
    for (const c of coursesData) {
      const course = courseRepo.create({
        ...c,
        createdBy: admin.id,
        status: Status.ACTIVE,
      });
      courses.push(await courseRepo.save(course));
    }
    console.log(`Created ${courses.length} courses`);

    // ==================== CLASSES ====================
    console.log('Seeding classes...');
    const classesData = [
      { name: 'IELTS Starter Class A1', classCode: 'IELTS-S-A1', course: courses[0], teacher: teacher1, level: CourseLevel.S, kind: CourseKind.IELTS },
      { name: 'IELTS Foundation Class B1', classCode: 'IELTS-FI-B1', course: courses[1], teacher: teacher1, level: CourseLevel.FI, kind: CourseKind.IELTS },
      { name: 'TOEIC Basic Class C1', classCode: 'TOEIC-TC-C1', course: courses[3], teacher: teacher2, level: CourseLevel.TC, kind: CourseKind.TOEIC },
    ];

    const classes: Class[] = [];
    for (const c of classesData) {
      const cls = classRepo.create({
        name: c.name,
        classCode: c.classCode,
        courseId: c.course.id,
        teacherId: c.teacher.id,
        level: c.level,
        kind: c.kind,
        maxStudents: 30,
        status: Status.ACTIVE,
      });
      classes.push(await classRepo.save(cls));
    }
    console.log(`Created ${classes.length} classes`);

    // ==================== CLASS_STUDENTS ====================
    console.log('Seeding class students...');
    // Add students to first class
    for (const student of students) {
      const classStudent = classStudentRepo.create({
        classId: classes[0].id,
        studentId: student.id,
        status: Status.ACTIVE,
      });
      await classStudentRepo.save(classStudent);
    }
    console.log(`Added ${students.length} students to class ${classes[0].name}`);

    // ==================== LESSONS ====================
    console.log('Seeding lessons...');
    const lessonsData = [
      { code: 'IELTS-S-L01', name: 'Introduction to IELTS', description: 'Giới thiệu về kỳ thi IELTS', orderIndex: 1 },
      { code: 'IELTS-S-L02', name: 'Listening Skills Basic', description: 'Kỹ năng nghe cơ bản', orderIndex: 2 },
      { code: 'IELTS-S-L03', name: 'Reading Skills Basic', description: 'Kỹ năng đọc cơ bản', orderIndex: 3 },
      { code: 'IELTS-S-L04', name: 'Writing Task 1 Introduction', description: 'Giới thiệu Writing Task 1', orderIndex: 4 },
      { code: 'IELTS-S-L05', name: 'Speaking Part 1', description: 'Speaking Part 1 - Introduction', orderIndex: 5 },
    ];

    const lessons: Lesson[] = [];
    for (const l of lessonsData) {
      const lesson = lessonRepo.create({
        ...l,
        courseId: courses[0].id,
        classId: classes[0].id,
        durationMinutes: 60,
        status: Status.ACTIVE,
        createdBy: teacher1.id,
      });
      lessons.push(await lessonRepo.save(lesson));
    }
    console.log(`Created ${lessons.length} lessons`);

    // ==================== EXERCISE SECTIONS ====================
    console.log('Seeding exercise sections...');
    const sectionsData = [
      // Lesson 1 sections
      { lessonId: lessons[0].id, sectionType: ExerciseSectionType.VOCAB, title: 'IELTS Vocabulary', orderIndex: 1 },
      { lessonId: lessons[0].id, sectionType: ExerciseSectionType.GRAMMAR, title: 'Basic Grammar Review', orderIndex: 2 },
      { lessonId: lessons[0].id, sectionType: ExerciseSectionType.PRACTICE, title: 'Practice Exercises', orderIndex: 3 },
      // Lesson 2 sections
      { lessonId: lessons[1].id, sectionType: ExerciseSectionType.LISTENING, title: 'Listening Practice', orderIndex: 1 },
      { lessonId: lessons[1].id, sectionType: ExerciseSectionType.PRACTICE, title: 'Listening Questions', orderIndex: 2 },
      // Lesson 3 sections
      { lessonId: lessons[2].id, sectionType: ExerciseSectionType.READING, title: 'Reading Passage', orderIndex: 1 },
      { lessonId: lessons[2].id, sectionType: ExerciseSectionType.PRACTICE, title: 'Reading Questions', orderIndex: 2 },
      // Lesson 4 sections
      { lessonId: lessons[3].id, sectionType: ExerciseSectionType.VIDEO_GRAMMAR, title: 'Writing Structure Video', orderIndex: 1 },
      { lessonId: lessons[3].id, sectionType: ExerciseSectionType.WRITING, title: 'Writing Practice', orderIndex: 2 },
      // Lesson 5 sections
      { lessonId: lessons[4].id, sectionType: ExerciseSectionType.SPEAKING, title: 'Speaking Practice', orderIndex: 1 },
    ];

    const sections: ExerciseSection[] = [];
    for (const s of sectionsData) {
      const section = sectionRepo.create({
        ...s,
        description: `${s.title} section`,
        totalPoints: 0,
        estimatedTime: 15,
        status: Status.ACTIVE,
      });
      sections.push(await sectionRepo.save(section));
    }
    console.log(`Created ${sections.length} exercise sections`);

    // ==================== QUESTIONS ====================
    console.log('Seeding questions...');
    const questionsData = [
      // Vocab questions for Lesson 1
      {
        sectionId: sections[0].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        questionText: 'What is the meaning of "abundant"?',
        options: ['Rare', 'Plentiful', 'Small', 'Difficult'],
        answer: 'Plentiful',
        explanation: 'Abundant means existing in large quantities; plentiful.',
        difficulty: DifficultyLevel.EASY,
        points: 1,
        orderIndex: 1,
      },
      {
        sectionId: sections[0].id,
        questionType: QuestionType.WORD_BANK,
        questionText: 'Complete the sentence: The garden was _____ with flowers.',
        wordBank: [{ id: 1, name: 'abundant' }, { id: 2, name: 'rare' }, { id: 3, name: 'empty' }],
        correctWordIds: [1],
        answer: 'abundant',
        difficulty: DifficultyLevel.EASY,
        points: 1,
        orderIndex: 2,
      },
      // Grammar questions
      {
        sectionId: sections[1].id,
        questionType: QuestionType.FILL_BLANK,
        questionText: 'She _____ (go) to school every day.',
        answer: 'goes',
        explanation: 'Use present simple for habitual actions. Third person singular adds -es.',
        grammarTopic: 'Present Simple Tense',
        difficulty: DifficultyLevel.EASY,
        points: 1,
        orderIndex: 1,
      },
      {
        sectionId: sections[1].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        questionText: 'Which sentence is grammatically correct?',
        options: ['He don\'t like coffee.', 'He doesn\'t like coffee.', 'He not like coffee.', 'He no like coffee.'],
        answer: 'He doesn\'t like coffee.',
        explanation: 'Third person singular negative uses "doesn\'t".',
        grammarTopic: 'Present Simple Negative',
        difficulty: DifficultyLevel.EASY,
        points: 1,
        orderIndex: 2,
      },
      // Listening questions
      {
        sectionId: sections[3].id,
        questionType: QuestionType.MULTIPLE_CHOICE,
        questionText: 'What is the main topic of the conversation?',
        audioUrl: 'https://example.com/audio/listening1.mp3',
        options: ['Travel plans', 'Work schedule', 'Weather forecast', 'Shopping list'],
        answer: 'Travel plans',
        difficulty: DifficultyLevel.MEDIUM,
        points: 2,
        orderIndex: 1,
      },
      // Reading questions
      {
        sectionId: sections[5].id,
        questionType: QuestionType.TRUE_FALSE,
        questionText: 'According to the passage, climate change affects only polar regions.',
        passage: 'Climate change is a global phenomenon affecting every corner of our planet. From melting ice caps in polar regions to rising sea levels threatening coastal communities, the impacts are far-reaching.',
        answer: 'false',
        explanation: 'The passage states climate change affects "every corner of our planet", not just polar regions.',
        difficulty: DifficultyLevel.MEDIUM,
        points: 1,
        orderIndex: 1,
      },
      // Writing question
      {
        sectionId: sections[8].id,
        questionType: QuestionType.ESSAY,
        questionText: 'Describe the chart showing population growth in different countries.',
        hints: ['Start with an overview', 'Mention key trends', 'Compare data points'],
        sampleAnswer: 'The chart illustrates the population growth trends in several countries over a 50-year period...',
        rubric: { grammar: 25, vocabulary: 25, coherence: 25, total: 75 },
        difficulty: DifficultyLevel.HARD,
        points: 10,
        orderIndex: 1,
      },
      // Speaking question
      {
        sectionId: sections[9].id,
        questionType: QuestionType.SHORT_ANSWER,
        questionText: 'Describe your hometown. What do you like most about it?',
        topicArea: 'Personal Information',
        evaluationCriteria: { pronunciation: 25, fluency: 25, grammar: 25, vocabulary: 25, total: 100 },
        sampleAnswer: 'My hometown is a small coastal city known for its beautiful beaches and friendly people...',
        difficulty: DifficultyLevel.MEDIUM,
        points: 5,
        orderIndex: 1,
      },
    ];

    for (const q of questionsData) {
      const question = questionRepo.create({
        ...q,
        status: Status.ACTIVE,
      });
      await questionRepo.save(question);
    }
    console.log(`Created ${questionsData.length} questions`);

    // Update section total points
    for (const section of sections) {
      const questions = await questionRepo.find({ where: { sectionId: section.id } });
      const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
      await sectionRepo.update(section.id, { totalPoints });
    }
    console.log('Updated section total points');

    console.log('\n========================================');
    console.log('  Seed completed successfully!');
    console.log('========================================');
    console.log('\nTest accounts:');
    console.log('  Admin: admin@example.com / Admin@123');
    console.log('  Teacher: teacher1@example.com / Admin@123');
    console.log('  Student: student1@example.com / Student@123');
    console.log('========================================\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
