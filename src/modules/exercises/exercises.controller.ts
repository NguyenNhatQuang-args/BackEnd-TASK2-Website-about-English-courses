import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import {
  CreateExerciseDTO,
  UpdateExerciseDTO,
  CreateExerciseSectionDTO,
  SubmitWordBankDTO,
} from './exercises.dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() dto: CreateExerciseDTO, @Query('lessonId') lessonId?: number) {
    return this.exercisesService.create(dto, lessonId);
  }

  @Get()
  async findAll() {
    return this.exercisesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.exercisesService.findById(id);
  }

  @Get('lesson/:lessonId')
  async findByLessonId(@Param('lessonId') lessonId: number) {
    return this.exercisesService.findByLessonId(lessonId);
  }

  @Get('course/:courseId')
  async findByCourseId(@Param('courseId') courseId: string) {
    return this.exercisesService.findByCourseId(courseId);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateExerciseDTO,
  ) {
    return this.exercisesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.exercisesService.delete(id);
  }

  @Post(':id/sections')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async addSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateExerciseSectionDTO,
  ) {
    return this.exercisesService.addSection(id, dto);
  }

  @Put(':id/sections/:sectionId')
  async updateSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('sectionId') sectionId: string,
    @Body() updates: Partial<any>,
  ) {
    return this.exercisesService.updateSection(id, sectionId, updates);
  }

  @Delete(':id/sections/:sectionId')
  async removeSection(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.exercisesService.removeSection(id, sectionId);
  }

  @Post(':id/questions/:questionId/submit')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async submitWordBank(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('questionId') questionId: string,
    @Body() dto: SubmitWordBankDTO,
  ) {
    return this.exercisesService.submitWordBank(id, questionId, dto);
  }
}