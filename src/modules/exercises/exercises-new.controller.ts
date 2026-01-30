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
import { ExercisesService } from './exercises-new.service';
import { CreateSectionDto, UpdateSectionDto, CreateQuestionDto, UpdateQuestionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('exercises')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  // ==================== SECTION ENDPOINTS ====================

  // GET /api/v1/exercises/section-types - Get all section types
  @Get('section-types')
  getSectionTypes() {
    return {
      success: true,
      message: 'Lấy danh sách loại phần học thành công',
      data: this.exercisesService.getSectionTypes(),
    };
  }

  // POST /api/v1/exercises/sections - Create new section
  @Post('sections')
  @Roles('ADMIN', 'TEACHER')
  async createSection(@Body() createSectionDto: CreateSectionDto) {
    const result = await this.exercisesService.createSection(createSectionDto);
    return {
      success: true,
      message: 'Tạo phần học thành công',
      data: result,
    };
  }

  // GET /api/v1/exercises/sections - Get all sections
  @Get('sections')
  async findAllSections() {
    const result = await this.exercisesService.findAllSections();
    return {
      success: true,
      message: 'Lấy danh sách phần học thành công',
      data: result,
      total: result.length,
    };
  }

  // GET /api/v1/exercises/sections/lesson/:lessonId - Get sections by lesson
  @Get('sections/lesson/:lessonId')
  async findSectionsByLesson(@Param('lessonId', ParseUUIDPipe) lessonId: string) {
    const result = await this.exercisesService.findSectionsByLesson(lessonId);
    return {
      success: true,
      message: 'Lấy danh sách phần học theo bài học thành công',
      data: result,
      total: result.length,
    };
  }

  // GET /api/v1/exercises/sections/:id - Get section by ID
  @Get('sections/:id')
  async findSectionById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.exercisesService.findSectionById(id);
    return {
      success: true,
      message: 'Lấy thông tin phần học thành công',
      data: result,
    };
  }

  // GET /api/v1/exercises/sections/:id/with-questions - Get section with questions
  @Get('sections/:id/with-questions')
  async findSectionWithQuestions(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.exercisesService.findSectionWithQuestions(id);
    return {
      success: true,
      message: 'Lấy thông tin phần học với câu hỏi thành công',
      data: result,
    };
  }

  // PUT /api/v1/exercises/sections/:id - Update section
  @Put('sections/:id')
  @Roles('ADMIN', 'TEACHER')
  async updateSection(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    const result = await this.exercisesService.updateSection(id, updateSectionDto);
    return {
      success: true,
      message: 'Cập nhật phần học thành công',
      data: result,
    };
  }

  // DELETE /api/v1/exercises/sections/:id - Delete section
  @Delete('sections/:id')
  @Roles('ADMIN')
  async deleteSection(@Param('id', ParseUUIDPipe) id: string) {
    await this.exercisesService.deleteSection(id);
    return {
      success: true,
      message: 'Xóa phần học thành công',
    };
  }

  // ==================== QUESTION ENDPOINTS ====================

  // POST /api/v1/exercises/questions - Create new question
  @Post('questions')
  @Roles('ADMIN', 'TEACHER')
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    const result = await this.exercisesService.createQuestion(createQuestionDto);
    return {
      success: true,
      message: 'Tạo câu hỏi thành công',
      data: result,
    };
  }

  // POST /api/v1/exercises/questions/bulk - Create multiple questions
  @Post('questions/bulk')
  @Roles('ADMIN', 'TEACHER')
  async createBulkQuestions(@Body() questions: CreateQuestionDto[]) {
    const result = await this.exercisesService.createBulkQuestions(questions);
    return {
      success: true,
      message: 'Tạo câu hỏi hàng loạt thành công',
      data: result,
      total: result.length,
    };
  }

  // GET /api/v1/exercises/questions - Get all questions
  @Get('questions')
  async findAllQuestions() {
    const result = await this.exercisesService.findAllQuestions();
    return {
      success: true,
      message: 'Lấy danh sách câu hỏi thành công',
      data: result,
      total: result.length,
    };
  }

  // GET /api/v1/exercises/questions/section/:sectionId - Get questions by section
  @Get('questions/section/:sectionId')
  async findQuestionsBySection(@Param('sectionId', ParseUUIDPipe) sectionId: string) {
    const result = await this.exercisesService.findQuestionsBySection(sectionId);
    return {
      success: true,
      message: 'Lấy danh sách câu hỏi theo phần học thành công',
      data: result,
      total: result.length,
    };
  }

  // GET /api/v1/exercises/questions/:id - Get question by ID
  @Get('questions/:id')
  async findQuestionById(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.exercisesService.findQuestionById(id);
    return {
      success: true,
      message: 'Lấy thông tin câu hỏi thành công',
      data: result,
    };
  }

  // PUT /api/v1/exercises/questions/:id - Update question
  @Put('questions/:id')
  @Roles('ADMIN', 'TEACHER')
  async updateQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const result = await this.exercisesService.updateQuestion(id, updateQuestionDto);
    return {
      success: true,
      message: 'Cập nhật câu hỏi thành công',
      data: result,
    };
  }

  // DELETE /api/v1/exercises/questions/:id - Delete question
  @Delete('questions/:id')
  @Roles('ADMIN')
  async deleteQuestion(@Param('id', ParseUUIDPipe) id: string) {
    await this.exercisesService.deleteQuestion(id);
    return {
      success: true,
      message: 'Xóa câu hỏi thành công',
    };
  }

  // ==================== COMBINED ENDPOINTS ====================

  // GET /api/v1/exercises/lesson/:lessonId - Get full lesson exercises
  @Get('lesson/:lessonId')
  async getLessonExercises(@Param('lessonId', ParseUUIDPipe) lessonId: string) {
    const result = await this.exercisesService.getLessonExercises(lessonId);
    return {
      success: true,
      message: 'Lấy bài tập của bài học thành công',
      data: result,
    };
  }
}
