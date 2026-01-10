import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { PermissionAction, PermissionResource } from '../../../constants';

export class PermissionQueryDto {
  @IsOptional()
  @IsEnum(PermissionAction, { message: 'Action không hợp lệ' })
  action?: PermissionAction;

  @IsOptional()
  @IsEnum(PermissionResource, { message: 'Resource không hợp lệ' })
  resource?: PermissionResource;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
