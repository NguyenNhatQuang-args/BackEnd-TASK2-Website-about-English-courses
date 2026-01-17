import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LessonsDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên bài học không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã bài học không được để trống' })
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'ID lớp học là bắt buộc' })
  classId: number;
}