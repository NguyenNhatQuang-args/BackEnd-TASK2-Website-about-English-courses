import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { Lesson, LessonDetail, Class, Course } from '../../entities';
import { ClassModule } from '../class/class.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, LessonDetail, Class, Course]),
    forwardRef(() => ClassModule),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService, TypeOrmModule],
})
export class LessonsModule {}