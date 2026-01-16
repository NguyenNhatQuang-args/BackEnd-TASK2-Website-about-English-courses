import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { Lesson } from './lessons.entity'; // Có chữ 's'
import { Class } from '../class/class.entity';
import { ClassModule } from '../class/class.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson, Class]),
    forwardRef(() => ClassModule),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService, TypeOrmModule],
})
export class LessonsModule {}