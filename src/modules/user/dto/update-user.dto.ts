import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  Matches,
  IsDateString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../../constants';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Họ tên không được quá 100 ký tự' })
  fullname?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Số điện thoại không hợp lệ (10-15 số)',
  })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(255, { message: 'Email không được quá 255 ký tự' })
  email?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: boolean;
}
