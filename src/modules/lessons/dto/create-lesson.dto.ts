import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, MaxLength, Matches } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã bài học không được để trống' })
  @MaxLength(50, { message: 'Mã bài học không được quá 50 ký tự' })
  @Matches(/^[A-Z0-9_-]+$/, {
    message: 'Mã bài học phải viết hoa và chỉ chứa chữ cái, số, dấu gạch dưới, gạch ngang',
  })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên bài học không được để trống' })
  @MaxLength(255, { message: 'Tên bài học không được quá 255 ký tự' })
  name: string;

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
}
