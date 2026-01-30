import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './exercises-new.controller';
import { ExercisesService } from './exercises-new.service';
import { Lesson, ExerciseSection, Question } from '../../entities';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, ExerciseSection, Question]),
    forwardRef(() => LessonsModule),
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService, TypeOrmModule],
})
export class ExercisesModule {}
