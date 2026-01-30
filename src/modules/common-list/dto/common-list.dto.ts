import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  MaxLength,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';
import { CommonListType } from '../common-list.entity';

export class CreateCommonListDto {
  @IsEnum(CommonListType, { message: 'Type phải là KIND_OF_COURSE, LEVEL hoặc ROLE' })
  @IsNotEmpty({ message: 'Type không được để trống' })
  type: CommonListType;

  @IsString()
  @IsNotEmpty({ message: 'Code không được để trống' })
  @MaxLength(50, { message: 'Code không được quá 50 ký tự' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Name không được để trống' })
  @MaxLength(100, { message: 'Name không được quá 100 ký tự' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class UpdateCommonListDto {
  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Code không được quá 50 ký tự' })
  code?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Name không được quá 100 ký tự' })
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class QueryCommonListDto {
  @IsEnum(CommonListType)
  @IsOptional()
  type?: CommonListType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
