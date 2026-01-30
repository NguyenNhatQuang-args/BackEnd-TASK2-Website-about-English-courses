import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('lessons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // POST /api/v1/lessons - Create new lesson
  @Post()
  @Roles('ADMIN', 'TEACHER')
  async create(@Body() createLessonDto: CreateLessonDto) {
    const result = await this.lessonsService.create(createLessonDto);
    return {
      success: true,
      message: 'Tạo bài học thành công',
      data: result,
    };
  }

  // GET /api/v1/lessons - Get all lessons
  @Get()
  async findAll() {
    const result = await this.lessonsService.findAll();
    return {
      success: true,
      message: 'Lấy danh sách bài học thành công',
      data: result,
      total: result.length,
    };
  }

  // GET /api/v1/lessons/class/:classId - Get lessons by class
  @Get('class/:classId')
  async findAllByClass(@Param('classId', ParseUUIDPipe) classId: string) {
    const result = await this.lessonsService.findAllByClass(classId);
    return {
      success: true,
      message: 'Lấy danh sách bài học theo lớp thành công',
      data: result,
      total: result.length,
    };
  }

  // GET /api/v1/lessons/course/:courseId - Get lessons by course
  @Get('course/:courseId')
  async findAllByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    const result = await this.lessonsService.findAllByCourse(courseId);
    return {
      success: true,
      message: 'Lấy danh sách bài học theo khóa học thành công',
      data: result,
      total: result.length,
    };
  }

  // GET /api/v1/lessons/:id - Get lesson by ID
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.lessonsService.findOne(id);
    return {
      success: true,
      message: 'Lấy thông tin bài học thành công',
      data: result,
    };
  }

  // PUT /api/v1/lessons/:id - Update lesson
  @Put(':id')
  @Roles('ADMIN', 'TEACHER')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    const result = await this.lessonsService.update(id, updateLessonDto);
    return {
      success: true,
      message: 'Cập nhật bài học thành công',
      data: result,
    };
  }

  // DELETE /api/v1/lessons/:id - Delete lesson
  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    await this.lessonsService.delete(id);
    return {
      success: true,
      message: 'Xóa bài học thành công',
    };
  }
}