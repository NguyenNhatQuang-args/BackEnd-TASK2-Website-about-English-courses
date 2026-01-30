import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    UseGuards,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto, AddStudentsDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    // POST /api/v1/classes - Create new class
    @Post()
    @Roles('ADMIN', 'TEACHER')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createClassDto: CreateClassDto) {
        const result = await this.classService.create(createClassDto);
        return {
            success: true,
            message: 'Tạo lớp học thành công',
            data: result,
        };
    }

    // GET /api/v1/classes - Get all classes
    @Get()
    async findAll() {
        const result = await this.classService.findAll();
        return {
            success: true,
            message: 'Lấy danh sách lớp học thành công',
            data: result,
            total: result.length,
        };
    }

    // GET /api/v1/classes/:id - Get class by ID
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.classService.findOneWithStudents(id);
        return {
            success: true,
            message: 'Lấy thông tin lớp học thành công',
            data: result,
        };
    }

    // PUT /api/v1/classes/:id - Update class
    @Put(':id')
    @Roles('ADMIN', 'TEACHER')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateClassDto: UpdateClassDto,
    ) {
        const result = await this.classService.update(id, updateClassDto);
        return {
            success: true,
            message: 'Cập nhật lớp học thành công',
            data: result,
        };
    }

    // DELETE /api/v1/classes/:id - Delete class
    @Delete(':id')
    @Roles('ADMIN')
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        await this.classService.delete(id);
        return {
            success: true,
            message: 'Xóa lớp học thành công',
        };
    }

    // GET /api/v1/classes/:id/students - Get students of a class
    @Get(':id/students')
    async getStudents(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.classService.getStudentsByClassId(id);
        return {
            success: true,
            message: 'Lấy danh sách học sinh thành công',
            data: result,
            total: result.length,
        };
    }

    // POST /api/v1/classes/:id/students - Add students to class
    @Post(':id/students')
    @Roles('ADMIN', 'TEACHER')
    async addStudents(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() addStudentsDto: AddStudentsDto,
    ) {
        const result = await this.classService.addStudents(id, addStudentsDto);
        return {
            success: true,
            message: 'Thêm học sinh vào lớp thành công',
            data: result,
        };
    }

    // DELETE /api/v1/classes/:id/students/:studentId - Remove student from class
    @Delete(':id/students/:studentId')
    @Roles('ADMIN', 'TEACHER')
    async removeStudent(
        @Param('id', ParseUUIDPipe) id: string,
        @Param('studentId', ParseUUIDPipe) studentId: string,
    ) {
        const result = await this.classService.removeStudent(id, studentId);
        return {
            success: true,
            message: 'Xóa học sinh khỏi lớp thành công',
            data: result,
        };
    }
}