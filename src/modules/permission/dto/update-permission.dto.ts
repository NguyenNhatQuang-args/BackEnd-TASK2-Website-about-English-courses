import {
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsArray,
  IsEnum,
  Matches,
} from 'class-validator';
import { UserRole } from '../../../constants';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Mã quyền không được quá 50 ký tự' })
  @Matches(/^[A-Z_]+$/, {
    message: 'Mã quyền chỉ được chứa chữ hoa và dấu gạch dưới',
  })
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Tên quyền không được quá 100 ký tự' })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Roles phải là một mảng' })
  @IsEnum(UserRole, { each: true, message: 'Role không hợp lệ (admin, user, teacher)' })
  roles?: UserRole[];

  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean;
}
