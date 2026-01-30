// Common Status
export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// User Role
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}

// Permission Action
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

// Permission Resource
export enum PermissionResource {
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  COURSES = 'courses',
  LESSONS = 'lessons',
  CLASSES = 'classes',
  PROFILE = 'profile',
  EXERCISES = 'exercises',
}

// Course Level
export enum CourseLevel {
  S = 'S',
  PRES = 'Pres',
  TC = 'TC',
  MTC = 'MTC',
  FI = 'FI',
  EF = 'EF',
  TE = 'TE',
  ME = 'ME',
}

// Course Kind
export enum CourseKind {
  IELTS = 'IELTS',
  TOEIC = 'TOEIC',
  SKILL_4 = '4SKILL',
}

// Exercise Section Type
export enum ExerciseSectionType {
  VOCAB = 'vocab',
  GRAMMAR = 'grammar',
  PRACTICE = 'practice',
  VIDEO_GRAMMAR = 'video_grammar',
  LISTENING = 'listening',
  WRITING = 'writing',
  READING = 'reading',
  SPEAKING = 'speaking',
}

// Question Type
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_BLANK = 'fill_blank',
  MATCH = 'match',
  ARRANGE = 'arrange',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  WORD_BANK = 'word_bank',
  TRUE_FALSE = 'true_false',
}

// Difficulty Level
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}
