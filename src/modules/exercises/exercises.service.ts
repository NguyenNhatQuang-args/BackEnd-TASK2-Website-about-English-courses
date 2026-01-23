import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseEntity } from './exercises.entity';
import { Lesson } from '../lessons/lessons.entity';
import { CreateExerciseDTO, UpdateExerciseDTO, CreateExerciseSectionDTO, SubmitWordBankDTO } from './exercises.dto';
import { ExerciseSection, Dang1_WordBank, WordBankUserState, WordBankSubmissionResponse, QuestionUnion } from '../../types/exercise.type';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(ExerciseEntity)
    private readonly exerciseRepository: Repository<ExerciseEntity>,

    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async create(dto: CreateExerciseDTO, lessonId?: number): Promise<ExerciseEntity> {
    if (lessonId) {
      const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
      if (!lesson) {
        throw new NotFoundException(`Lesson với ID ${lessonId} không tồn tại!`);
      }
    }

    const sections: ExerciseSection[] = (dto.sections || []).map((sectionDto) => ({
      id: `section_${Date.now()}_${Math.random()}`,
      lessonId: sectionDto.lessonId,
      sectionType: sectionDto.sectionType as any,
      title: sectionDto.title,
      description: sectionDto.description || '',
      questions: (sectionDto.questions || []) as QuestionUnion[],
      totalPoints: 0,
      estimatedTime: 0,
      order: sectionDto.order,
    }));

    const newExercise = new ExerciseEntity({
      courseId: dto.courseId,
      lessonNumber: dto.lessonNumber,
      title: dto.title,
      description: dto.description,
      sections,
    });

    return await this.exerciseRepository.save(newExercise);
  }

  async findAll(): Promise<ExerciseEntity[]> {
    return await this.exerciseRepository.find({
      relations: ['lesson'],
      order: { lessonNumber: 'ASC' },
    });
  }

  async findById(id: string): Promise<ExerciseEntity> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['lesson'],
    });

    if (!exercise) {
      throw new NotFoundException(`Bài tập với ID ${id} không tồn tại!`);
    }

    return exercise;
  }

  async findByLessonId(lessonId: number): Promise<ExerciseEntity[]> {
    return await this.exerciseRepository.find({
      relations: ['lesson'],
      order: { lessonNumber: 'ASC' },
    }).then(exercises => exercises.filter(e => e.lessonNumber));
  }

  async findByCourseId(courseId: string): Promise<ExerciseEntity[]> {
    return await this.exerciseRepository.find({
      where: { courseId },
      relations: ['lesson'],
      order: { lessonNumber: 'ASC' },
    });
  }

  async update(id: string, dto: UpdateExerciseDTO): Promise<ExerciseEntity> {
    const exercise = await this.findById(id);

    Object.assign(exercise, {
      title: dto.title || exercise.title,
      description: dto.description || exercise.description,
      sections: dto.sections || exercise.sections,
    });

    return await this.exerciseRepository.save(exercise);
  }

  async delete(id: string): Promise<{ message: string }> {
    const exercise = await this.findById(id);
    await this.exerciseRepository.remove(exercise);
    return { message: `Bài tập ${id} đã bị xóa thành công!` };
  }

  async addSection(exerciseId: string, dto: CreateExerciseSectionDTO): Promise<ExerciseEntity> {
    const exercise = await this.findById(exerciseId);

    const newSection: ExerciseSection = {
      id: `section_${Date.now()}`,
      lessonId: dto.lessonId,
      sectionType: dto.sectionType as any,
      title: dto.title,
      description: dto.description || '',
      questions: (dto.questions || []) as QuestionUnion[],
      totalPoints: 0,
      estimatedTime: 0,
      order: dto.order || (exercise.sections?.length || 0) + 1,
    };

    exercise.addSection(newSection);
    return await this.exerciseRepository.save(exercise);
  }

  async updateSection(
    exerciseId: string,
    sectionId: string,
    updates: Partial<ExerciseSection>,
  ): Promise<ExerciseEntity> {
    const exercise = await this.findById(exerciseId);
    exercise.updateSection(sectionId, updates);
    return await this.exerciseRepository.save(exercise);
  }

  async removeSection(exerciseId: string, sectionId: string): Promise<ExerciseEntity> {
    const exercise = await this.findById(exerciseId);
    exercise.removeSection(sectionId);
    return await this.exerciseRepository.save(exercise);
  }

  async submitWordBank(
    exerciseId: string,
    questionId: string,
    dto: SubmitWordBankDTO,
  ): Promise<WordBankSubmissionResponse> {
    const exercise = await this.findById(exerciseId);

    let targetQuestion: Dang1_WordBank | null = null;
    let foundSection: ExerciseSection | null = null;

    for (const section of exercise.sections || []) {
      for (const question of section.questions) {
        if (question.id === questionId && question.questionType === 'practice') {
          targetQuestion = question as any;
          foundSection = section;
          break;
        }
      }
      if (targetQuestion) break;
    }

    if (!targetQuestion || !foundSection) {
      throw new NotFoundException(`Question ${questionId} không tìm thấy!`);
    }

    const isCorrect =
      JSON.stringify(dto.selectedWordIds.sort()) ===
      JSON.stringify(targetQuestion.correctWordIds.sort());

    const userAnswer = this.constructAnswerFromWordIds(
      targetQuestion.workBanks,
      dto.selectedWordIds,
    );

    return {
      success: true,
      isCorrect,
      message: isCorrect ? 'Chính xác!' : 'Sai rồi. Hãy thử lại!',
      selectedAnswer: userAnswer,
      correctAnswer: targetQuestion.answer,
      attemptCount: 1,
      pointsAwarded: isCorrect ? targetQuestion.points : 0,
      explanation: targetQuestion.explanation,
    };
  }

  private constructAnswerFromWordIds(
    workBanks: any[],
    wordIds: (string | number)[],
  ): string {
    return wordIds
      .map(id => {
        const word = workBanks.find(w => w.id.toString() === id.toString());
        return word ? word.name : '';
      })
      .join(' ');
  }
}