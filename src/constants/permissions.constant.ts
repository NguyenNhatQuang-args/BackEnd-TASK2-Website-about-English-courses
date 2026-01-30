// Re-export from entities for backward compatibility
export { PermissionAction, PermissionResource } from '../entities/enums';

import { PermissionAction, PermissionResource, UserRole } from '../entities/enums';

// Mảng các action và resource
export const PERMISSION_ACTIONS: string[] = Object.values(PermissionAction);
export const PERMISSION_RESOURCES: string[] = Object.values(PermissionResource);

// Default permissions cho mỗi role (comma-separated strings for DB)
export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'manage:users,manage:roles,manage:permissions,manage:courses,manage:lessons,manage:classes',
  [UserRole.TEACHER]: 'read:users,create:courses,read:courses,update:courses,create:lessons,read:lessons,update:lessons,delete:lessons,create:classes,read:classes,update:classes,update:profile',
  [UserRole.STUDENT]: 'read:courses,read:lessons,read:classes,read:profile,update:profile',
};

// Default permissions as arrays (for seed and validation)
export const DEFAULT_ROLE_PERMISSIONS_ARRAY: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: [
    'manage:users',
    'manage:roles',
    'manage:permissions',
    'manage:courses',
    'manage:lessons',
    'manage:classes',
  ],
  [UserRole.TEACHER]: [
    'read:users',
    'create:courses',
    'read:courses',
    'update:courses',
    'create:lessons',
    'read:lessons',
    'update:lessons',
    'delete:lessons',
    'create:classes',
    'read:classes',
    'update:classes',
    'update:profile',
  ],
  [UserRole.STUDENT]: [
    'read:courses',
    'read:lessons',
    'read:classes',
    'read:profile',
    'update:profile',
  ],
};
