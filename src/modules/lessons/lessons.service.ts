import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lessons.entity'; 
import { LessonsDto } from './lessons.dto';
import { Class } from '../class/class.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(dto: LessonsDto) {
    // Kiểm tra mã bài học trùng lặp
    const existLesson = await this.lessonRepository.findOne({ where: { code: dto.code } });
    if (existLesson) {
      throw new BadRequestException(`Mã bài học '${dto.code}' đã tồn tại!`);
    }

    // Kiểm tra ID lớp học hợp lệ
    const classroom = await this.classRepository.findOne({ where: { id: dto.classId } });
    if (!classroom) {
      throw new NotFoundException(`Lớp học với ID ${dto.classId} không tồn tại!`);
    }

    const newLesson = this.lessonRepository.create({
      name: dto.name,
      code: dto.code,
      description: dto.description,
      class: classroom,
    });

    return await this.lessonRepository.save(newLesson);
  }

  async findAllByClass(classId: number) {
    return await this.lessonRepository.find({
      where: { class: { id: classId } },
      relations: ['class'],
      order: { id: 'ASC' }
    });
  }
}