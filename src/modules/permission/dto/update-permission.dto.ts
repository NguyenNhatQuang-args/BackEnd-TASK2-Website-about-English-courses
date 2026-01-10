import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { PermissionAction, PermissionResource } from '../../../constants';

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Tên permission không được quá 100 ký tự' })
  name?: string;

  @IsOptional()
  @IsEnum(PermissionAction, { message: 'Action không hợp lệ' })
  action?: PermissionAction;

  @IsOptional()
  @IsEnum(PermissionResource, { message: 'Resource không hợp lệ' })
  resource?: PermissionResource;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive phải là boolean' })
  isActive?: boolean;
}
