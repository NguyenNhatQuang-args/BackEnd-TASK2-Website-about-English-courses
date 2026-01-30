import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { CourseLevel, CourseKind, Status } from '../../entities/enums';

export class CreateClassDto {
    @IsString()
    @IsNotEmpty()
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

    @IsEnum(CourseLevel)
    @IsOptional()
    level?: CourseLevel;

    @IsEnum(CourseKind)
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
    @IsString({ each: true })
    @IsOptional()
    studentIds?: string[];
}