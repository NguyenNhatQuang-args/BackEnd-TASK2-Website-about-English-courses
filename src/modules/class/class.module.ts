import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { User } from '../../entities/user.entity';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { LessonsModule } from '../lessons/lessons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, User]),
    forwardRef(() => LessonsModule),
  ],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService, TypeOrmModule],
})
export class ClassModule {}