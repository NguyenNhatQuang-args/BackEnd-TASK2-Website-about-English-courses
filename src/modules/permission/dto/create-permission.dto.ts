import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  IsEnum,
  Matches,
} from 'class-validator';
import { UserRole } from '../../../entities/enums';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã quyền không được để trống' })
  @MaxLength(50, { message: 'Mã quyền không được quá 50 ký tự' })
  @Matches(/^[A-Z_]+$/, {
    message: 'Mã quyền phải viết hoa và chỉ chứa chữ cái và dấu gạch dưới (vd: CREATE_USER)',
  })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên quyền không được để trống' })
  @MaxLength(100, { message: 'Tên quyền không được quá 100 ký tự' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray({ message: 'Roles phải là mảng' })
  @IsEnum(UserRole, { each: true, message: 'Role không hợp lệ' })
  roles: UserRole[];
}
