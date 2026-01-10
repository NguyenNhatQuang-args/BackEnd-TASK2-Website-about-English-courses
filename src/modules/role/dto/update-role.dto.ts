import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Tên vai trò phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên vai trò không được quá 50 ký tự' })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray({ message: 'Permissions phải là một mảng' })
  @IsString({ each: true, message: 'Mỗi permission phải là string' })
  permissions?: string[];

  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean;
}
