import { IsArray, IsString, IsEnum, IsOptional, ArrayNotEmpty } from 'class-validator';
import { UserRole } from '../../../constants';

export class AssignRoleDto {
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role: UserRole;
}

export class AssignPermissionsDto {
  @IsArray({ message: 'Permissions phải là một mảng' })
  @ArrayNotEmpty({ message: 'Permissions không được để trống' })
  @IsString({ each: true, message: 'Mỗi permission phải là string' })
  permissions: string[];
}
