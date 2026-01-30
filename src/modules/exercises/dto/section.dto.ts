import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { ExerciseSectionType, Status } from '../../../entities/enums';

export class CreateSectionDto {
  @IsUUID()
  @IsNotEmpty({ message: 'Lesson ID không được để trống' })
  lessonId: string;

  @IsEnum(ExerciseSectionType, { message: 'Section type không hợp lệ' })
  sectionType: ExerciseSectionType;

  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsNumber()
  @IsOptional()
  totalPoints?: number;

  @IsNumber()
  @IsOptional()
  estimatedTime?: number;
}

export class UpdateSectionDto {
  @IsEnum(ExerciseSectionType, { message: 'Section type không hợp lệ' })
  @IsOptional()
  sectionType?: ExerciseSectionType;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsNumber()
  @IsOptional()
  totalPoints?: number;

  @IsNumber()
  @IsOptional()
  estimatedTime?: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
