import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { CourseLevel, CourseKind, Status } from '../../../entities/enums';

export class CreateClassDto {
    @IsString()
    @IsNotEmpty({ message: 'Tên lớp học không được để trống' })
    name: string;

    @IsString()
    @IsOptional()
    classCode?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsOptional()
    courseId?: string;

    @IsUUID()
    @IsOptional()
    teacherId?: string;

    @IsEnum(CourseLevel, { message: 'Level không hợp lệ' })
    @IsOptional()
    level?: CourseLevel;

    @IsEnum(CourseKind, { message: 'Kind không hợp lệ' })
    @IsOptional()
    kind?: CourseKind;

    @IsNumber()
    @IsOptional()
    maxStudents?: number;

    @IsOptional()
    startDate?: Date;

    @IsOptional()
    endDate?: Date;

    @IsEnum(Status)
    @IsOptional()
    status?: Status;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    studentIds?: string[];
}
