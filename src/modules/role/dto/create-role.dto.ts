import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  @MinLength(2, { message: 'Tên vai trò phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên vai trò không được quá 50 ký tự' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  description: string;

  @IsOptional()
  @IsArray({ message: 'Permissions phải là một mảng' })
  @IsString({ each: true, message: 'Mỗi permission phải là string' })
  permissions?: string[];
}
