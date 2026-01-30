import { AppDataSource } from '../config/database';
import { 
  User, 
  Role, 
  Permission, 
  Course, 
  Class, 
  Lesson, 
  LessonDetail,
  UserRole,
  Status,
  PermissionAction,
  PermissionResource,
  CourseLevel,
  CourseKind,
} from '../entities';
import { DEFAULT_ROLE_PERMISSIONS, ROLE_DESCRIPTIONS } from '../constants';

// Seed default permissions
const seedPermissions = async (): Promise<void> => {
  const permissionRepository = AppDataSource.getRepository(Permission);

  const permissions = [
    { name: 'manage:users', action: PermissionAction.MANAGE, resource: PermissionResource.USERS, description: 'Toàn quyền quản lý người dùng' },
    { name: 'manage:roles', action: PermissionAction.MANAGE, resource: PermissionResource.ROLES, description: 'Toàn quyền quản lý vai trò' },
    { name: 'manage:permissions', action: PermissionAction.MANAGE, resource: PermissionResource.PERMISSIONS, description: 'Toàn quyền quản lý quyền' },
    { name: 'manage:courses', action: PermissionAction.MANAGE, resource: PermissionResource.COURSES, description: 'Toàn quyền quản lý khóa học' },
    { name: 'manage:lessons', action: PermissionAction.MANAGE, resource: PermissionResource.LESSONS, description: 'Toàn quyền quản lý bài học' },
    { name: 'manage:classes', action: PermissionAction.MANAGE, resource: PermissionResource.CLASSES, description: 'Toàn quyền quản lý lớp học' },
    { name: 'create:courses', action: PermissionAction.CREATE, resource: PermissionResource.COURSES, description: 'Tạo khóa học' },
    { name: 'read:courses', action: PermissionAction.READ, resource: PermissionResource.COURSES, description: 'Xem khóa học' },
    { name: 'update:courses', action: PermissionAction.UPDATE, resource: PermissionResource.COURSES, description: 'Cập nhật khóa học' },
    { name: 'delete:courses', action: PermissionAction.DELETE, resource: PermissionResource.COURSES, description: 'Xóa khóa học' },
    { name: 'create:lessons', action: PermissionAction.CREATE, resource: PermissionResource.LESSONS, description: 'Tạo bài học' },
    { name: 'read:lessons', action: PermissionAction.READ, resource: PermissionResource.LESSONS, description: 'Xem bài học' },
    { name: 'update:lessons', action: PermissionAction.UPDATE, resource: PermissionResource.LESSONS, description: 'Cập nhật bài học' },
    { name: 'delete:lessons', action: PermissionAction.DELETE, resource: PermissionResource.LESSONS, description: 'Xóa bài học' },
    { name: 'create:classes', action: PermissionAction.CREATE, resource: PermissionResource.CLASSES, description: 'Tạo lớp học' },
    { name: 'read:classes', action: PermissionAction.READ, resource: PermissionResource.CLASSES, description: 'Xem lớp học' },
    { name: 'update:classes', action: PermissionAction.UPDATE, resource: PermissionResource.CLASSES, description: 'Cập nhật lớp học' },
    { name: 'read:users', action: PermissionAction.READ, resource: PermissionResource.USERS, description: 'Xem người dùng' },
    { name: 'read:profile', action: PermissionAction.READ, resource: PermissionResource.PROFILE, description: 'Xem hồ sơ cá nhân' },
    { name: 'update:profile', action: PermissionAction.UPDATE, resource: PermissionResource.PROFILE, description: 'Cập nhật hồ sơ' },
  ];

  for (const permData of permissions) {
    const existingPermission = await permissionRepository.findOne({ where: { name: permData.name } });
    if (!existingPermission) {
      const permission = permissionRepository.create(permData);
      await permissionRepository.save(permission);
      console.log(`Created permission: ${permData.name}`);
    }
  }
};

// Seed default roles
const seedRoles = async (): Promise<void> => {
  const roleRepository = AppDataSource.getRepository(Role);
  
  const roles = [
    {
      name: UserRole.ADMIN,
      description: ROLE_DESCRIPTIONS[UserRole.ADMIN],
      permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.ADMIN],
    },
    {
      name: UserRole.TEACHER,
      description: ROLE_DESCRIPTIONS[UserRole.TEACHER],
      permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.TEACHER],
    },
    {
      name: UserRole.STUDENT,
      description: ROLE_DESCRIPTIONS[UserRole.STUDENT],
      permissions: DEFAULT_ROLE_PERMISSIONS[UserRole.STUDENT],
    },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({ where: { name: roleData.name } });
    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`Created role: ${roleData.name}`);
    }
  }
};

// Seed default admin user
const seedAdminUser = async (): Promise<void> => {
  const userRepository = AppDataSource.getRepository(User);
  const adminUsername = 'admin';
  const existingAdmin = await userRepository.findOne({ where: { username: adminUsername } });

  if (!existingAdmin) {
    const admin = userRepository.create({
      username: adminUsername,
      fullname: 'System Administrator',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: UserRole.ADMIN,
      status: Status.ACTIVE,
    });
    await userRepository.save(admin);
    console.log('Created default admin user');
    console.log('   Username: admin');
    console.log('   Password: Admin@123');
  }
};

// Seed sample teacher
const seedTeacher = async (): Promise<void> => {
  const userRepository = AppDataSource.getRepository(User);
  const teacherUsername = 'teacher1';
  const existingTeacher = await userRepository.findOne({ where: { username: teacherUsername } });

  if (!existingTeacher) {
    const teacher = userRepository.create({
      username: teacherUsername,
      fullname: 'Nguyen Van A',
      email: 'teacher1@example.com',
      password: 'Admin@123',
      role: UserRole.TEACHER,
      status: Status.ACTIVE,
    });
    await userRepository.save(teacher);
    console.log('Created sample teacher: teacher1');
  }
};

// Seed sample courses
const seedCourses = async (): Promise<void> => {
  const courseRepository = AppDataSource.getRepository(Course);

  const courses = [
    { title: 'IELTS Starter', description: 'Khóa học IELTS dành cho người mới bắt đầu', level: CourseLevel.S, kind: CourseKind.IELTS, status: Status.ACTIVE },
    { title: 'IELTS Foundation', description: 'Khóa học IELTS nền tảng', level: CourseLevel.FI, kind: CourseKind.IELTS, status: Status.ACTIVE },
    { title: 'TOEIC Basic', description: 'Khóa học TOEIC cơ bản', level: CourseLevel.TC, kind: CourseKind.TOEIC, status: Status.ACTIVE },
    { title: '4 Skills Elementary', description: 'Khóa học 4 kỹ năng cơ bản', level: CourseLevel.EF, kind: CourseKind.SKILL_4, status: Status.ACTIVE },
  ];

  for (const courseData of courses) {
    const existingCourse = await courseRepository.findOne({ where: { title: courseData.title } });
    if (!existingCourse) {
      const course = courseRepository.create(courseData);
      await courseRepository.save(course);
      console.log(`Created course: ${courseData.title}`);
    }
  }
};

// Seed sample classes
const seedClasses = async (): Promise<void> => {
  const classRepository = AppDataSource.getRepository(Class);

  const classes = [
    { name: 'IELTS S - Lớp A1', classCode: 'IELTS-S-A1', description: 'Lớp IELTS Starter buổi sáng', level: CourseLevel.S, kind: CourseKind.IELTS, status: Status.ACTIVE },
    { name: 'IELTS FI - Lớp B1', classCode: 'IELTS-FI-B1', description: 'Lớp IELTS Foundation buổi tối', level: CourseLevel.FI, kind: CourseKind.IELTS, status: Status.ACTIVE },
    { name: 'TOEIC TC - Lớp C1', classCode: 'TOEIC-TC-C1', description: 'Lớp TOEIC cơ bản', level: CourseLevel.TC, kind: CourseKind.TOEIC, status: Status.ACTIVE },
  ];

  for (const classData of classes) {
    const existingClass = await classRepository.findOne({ where: { classCode: classData.classCode } });
    if (!existingClass) {
      const classEntity = classRepository.create(classData);
      await classRepository.save(classEntity);
      console.log(`Created class: ${classData.name}`);
    }
  }
};

// Seed sample lessons
const seedLessons = async (): Promise<void> => {
  const lessonRepository = AppDataSource.getRepository(Lesson);

  const lessons = [
    { code: 'IELTS-INTRO', name: 'Introduction to IELTS', description: 'Giới thiệu về kỳ thi IELTS', orderIndex: 1, status: Status.ACTIVE },
    { code: 'IELTS-LS-01', name: 'Listening Skills - Part 1', description: 'Kỹ năng nghe phần 1', orderIndex: 2, status: Status.ACTIVE },
    { code: 'IELTS-RD-01', name: 'Reading Techniques', description: 'Kỹ thuật đọc hiểu', orderIndex: 3, status: Status.ACTIVE },
    { code: 'IELTS-WR-01', name: 'Writing Task 1', description: 'Viết Task 1 - Mô tả biểu đồ', orderIndex: 4, status: Status.ACTIVE },
    { code: 'IELTS-SP-01', name: 'Speaking Part 1', description: 'Kỹ năng nói phần 1', orderIndex: 5, status: Status.ACTIVE },
  ];

  for (const lessonData of lessons) {
    const existingLesson = await lessonRepository.findOne({ where: { code: lessonData.code } });
    if (!existingLesson) {
      const lesson = lessonRepository.create(lessonData);
      await lessonRepository.save(lesson);
      console.log(`Created lesson: ${lessonData.name}`);
    }
  }
};

// Seed sample lesson details
const seedLessonDetails = async (): Promise<void> => {
  const lessonRepository = AppDataSource.getRepository(Lesson);
  const lessonDetailRepository = AppDataSource.getRepository(LessonDetail);

  const introLesson = await lessonRepository.findOne({ where: { name: 'Introduction to IELTS' } });
  if (introLesson) {
    const existingDetail = await lessonDetailRepository.findOne({ 
      where: { lessonId: introLesson.id, contentType: 'text' } 
    });
    
    if (!existingDetail) {
      const textDetail = lessonDetailRepository.create({
        lessonId: introLesson.id,
        contentType: 'text',
        title: 'Nội dung lý thuyết',
        content: 'Đây là nội dung chi tiết của bài học...',
        orderIndex: 1,
      });
      await lessonDetailRepository.save(textDetail);
      console.log('Created lesson detail: text content');

      const videoDetail = lessonDetailRepository.create({
        lessonId: introLesson.id,
        contentType: 'video',
        title: 'Video bài giảng',
        videoUrl: 'https://youtube.com/example',
        orderIndex: 2,
      });
      await lessonDetailRepository.save(videoDetail);
      console.log('Created lesson detail: video content');
    }
  }
};

// Main seed function
export const seedDefaultData = async (): Promise<void> => {
  console.log('\nSeeding default data...\n');

  try {
    await seedPermissions();
    await seedRoles();
    await seedAdminUser();
    await seedTeacher();
    await seedCourses();
    await seedClasses();
    await seedLessons();
    await seedLessonDetails();
    console.log('\nDefault data seeding completed!\n');
  } catch (error) {
    console.error('Error seeding default data:', error);
  }
};
