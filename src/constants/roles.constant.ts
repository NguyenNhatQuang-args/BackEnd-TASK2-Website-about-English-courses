// Re-export from entities for backward compatibility
export { UserRole, Status } from '../entities/enums';

import { UserRole } from '../entities/enums';

// Mảng các role để validate
export const USER_ROLES: string[] = Object.values(UserRole);

// Role mặc định khi tạo user mới
export const DEFAULT_USER_ROLE: UserRole = UserRole.STUDENT;

// Role descriptions - Mô tả các vai trò
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Quản trị viên - Toàn quyền hệ thống',
  [UserRole.TEACHER]: 'Giáo viên - Quản lý khóa học và bài học',
  [UserRole.STUDENT]: 'Học viên - Quyền cơ bản',
};
