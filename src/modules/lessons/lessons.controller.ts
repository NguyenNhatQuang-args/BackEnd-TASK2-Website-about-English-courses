import { Controller, Post, Body, Get, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsDto } from './lessons.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  /**
   * Tạo bài học mới
   * ValidationPipe sẽ tự động kiểm tra các decorator @IsString, @IsNotEmpty trong DTO
   */
  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() lessonsDto: LessonsDto) {
    return this.lessonsService.create(lessonsDto);
  }

  /**
   * Lấy danh sách bài học của một lớp
   */
  @Get('class/:classId')
  findAllByClass(@Param('classId', ParseIntPipe) classId: number) {
    return this.lessonsService.findAllByClass(classId);
  }
}