import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { Status } from '../../entities/enums';

export class LessonsDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề bài học không được để trống' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  courseId?: string;

  @IsUUID()
  @IsOptional()
  classId?: string;

  @IsNumber()
  @IsOptional()
  orderIndex?: number;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}