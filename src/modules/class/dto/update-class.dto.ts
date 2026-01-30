import { IsString, IsEnum, IsArray, IsOptional, IsUUID, IsNumber, IsBoolean } from 'class-validator';
import { CourseLevel, CourseKind, Status } from '../../../entities/enums';

export class UpdateClassDto {
    @IsString()
    @IsOptional()
    name?: string;

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
