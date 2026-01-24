import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  IsEnum,
  Matches,
} from 'class-validator';
import { UserRole } from '../../../constants';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã quyền không được để trống' })
  @MaxLength(50, { message: 'Mã quyền không được quá 50 ký tự' })
  @Matches(/^[A-Z_]+$/, {
    message: 'Mã quyền chỉ được chứa chữ hoa và dấu gạch dưới',
  })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên quyền không được để trống' })
  @MaxLength(100, { message: 'Tên quyền không được quá 100 ký tự' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray({ message: 'Roles phải là một mảng' })
  @IsEnum(UserRole, { each: true, message: 'Role không hợp lệ (admin, user, teacher)' })
  roles: UserRole[];
}
