import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson, Class, Status } from '../../entities';
import { CreateLessonDto, UpdateLessonDto } from './dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(dto: CreateLessonDto) {
    // Kiểm tra mã bài học trùng lặp
    const existLesson = await this.lessonRepository.findOne({ where: { code: dto.code } });
    if (existLesson) {
      throw new ConflictException(`Mã bài học '${dto.code}' đã tồn tại!`);
    }

    // Kiểm tra ID lớp học hợp lệ nếu có
    if (dto.classId) {
      const classroom = await this.classRepository.findOne({ where: { id: dto.classId } });
      if (!classroom) {
        throw new NotFoundException(`Lớp học với ID ${dto.classId} không tồn tại!`);
      }
    }

    const newLesson = this.lessonRepository.create({
      code: dto.code,
      name: dto.name,
      description: dto.description,
      classId: dto.classId,
      courseId: dto.courseId,
      orderIndex: dto.orderIndex || 0,
      durationMinutes: dto.durationMinutes,
      status: Status.ACTIVE,
    });

    return await this.lessonRepository.save(newLesson);
  }

  async findAllByClass(classId: string) {
    return await this.lessonRepository.find({
      where: { classId },
      relations: ['class', 'course'],
      order: { orderIndex: 'ASC' }
    });
  }

  async findAllByCourse(courseId: string) {
    return await this.lessonRepository.find({
      where: { courseId },
      relations: ['class', 'course'],
      order: { orderIndex: 'ASC' }
    });
  }

  async findAll() {
    return await this.lessonRepository.find({
      relations: ['class', 'course'],
      order: { orderIndex: 'ASC' }
    });
  }

  async findOne(id: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['class', 'course'],
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    return lesson;
  }

  async findByCode(code: string) {
    const lesson = await this.lessonRepository.findOne({
      where: { code },
      relations: ['class', 'course'],
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto) {
    const lesson = await this.lessonRepository.findOne({ where: { id } });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    // Check code uniqueness if changing
    if (dto.code && dto.code !== lesson.code) {
      const existLesson = await this.lessonRepository.findOne({ where: { code: dto.code } });
      if (existLesson) {
        throw new ConflictException(`Mã bài học '${dto.code}' đã tồn tại!`);
      }
    }

    Object.assign(lesson, dto);
    return await this.lessonRepository.save(lesson);
  }

  async delete(id: string) {
    const lesson = await this.lessonRepository.findOne({ where: { id } });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    await this.lessonRepository.remove(lesson);
    return { message: 'Xóa bài học thành công' };
  }
}