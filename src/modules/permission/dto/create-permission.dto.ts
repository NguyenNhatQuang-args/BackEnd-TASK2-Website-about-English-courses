import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { PermissionAction, PermissionResource } from '../../../constants';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên permission không được để trống' })
  @MaxLength(100, { message: 'Tên permission không được quá 100 ký tự' })
  name: string;

  @IsEnum(PermissionAction, { message: 'Action không hợp lệ' })
  action: PermissionAction;

  @IsEnum(PermissionResource, { message: 'Resource không hợp lệ' })
  resource: PermissionResource;

  @IsOptional()
  @IsString()
  description?: string;
}
