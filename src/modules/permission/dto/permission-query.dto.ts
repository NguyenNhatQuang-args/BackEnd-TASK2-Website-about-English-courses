import { IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../../constants';

export class PermissionQueryDto {
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role không hợp lệ' })
  role?: UserRole;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
