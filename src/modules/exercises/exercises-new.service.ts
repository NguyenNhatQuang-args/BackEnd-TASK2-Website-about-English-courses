import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseSection, Question, Lesson, Status } from '../../entities';
import { CreateSectionDto, UpdateSectionDto, CreateQuestionDto, UpdateQuestionDto } from './dto';
import { ExerciseSectionType } from '../../entities/enums';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(ExerciseSection)
    private readonly sectionRepository: Repository<ExerciseSection>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  // ==================== SECTION METHODS ====================

  async createSection(dto: CreateSectionDto): Promise<ExerciseSection> {
    // Verify lesson exists
    const lesson = await this.lessonRepository.findOne({ where: { id: dto.lessonId } });
    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    const section = this.sectionRepository.create({
      lessonId: dto.lessonId,
      sectionType: dto.sectionType,
      title: dto.title,
      description: dto.description || null,
      orderIndex: dto.orderIndex || 0,
      totalPoints: dto.totalPoints || 0,
      estimatedTime: dto.estimatedTime || 0,
      status: Status.ACTIVE,
    });

    return await this.sectionRepository.save(section);
  }

  async findAllSections(): Promise<ExerciseSection[]> {
    return await this.sectionRepository.find({
      relations: ['lesson'],
      order: { orderIndex: 'ASC' },
    });
  }

  async findSectionsByLesson(lessonId: string): Promise<ExerciseSection[]> {
    return await this.sectionRepository.find({
      where: { lessonId },
      relations: ['lesson'],
      order: { orderIndex: 'ASC' },
    });
  }

  async findSectionById(id: string): Promise<ExerciseSection> {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['lesson'],
    });

    if (!section) {
      throw new NotFoundException('Không tìm thấy phần học');
    }

    return section;
  }

  async findSectionWithQuestions(id: string): Promise<any> {
    const section = await this.findSectionById(id);
    const questions = await this.findQuestionsBySection(id);

    return {
      ...section,
      questions,
    };
  }

  async updateSection(id: string, dto: UpdateSectionDto): Promise<ExerciseSection> {
    const section = await this.sectionRepository.findOne({ where: { id } });

    if (!section) {
      throw new NotFoundException('Không tìm thấy phần học');
    }

    Object.assign(section, dto);
    return await this.sectionRepository.save(section);
  }

  async deleteSection(id: string): Promise<void> {
    const section = await this.sectionRepository.findOne({ where: { id } });

    if (!section) {
      throw new NotFoundException('Không tìm thấy phần học');
    }

    // Questions will be cascade deleted
    await this.sectionRepository.remove(section);
  }

  // Get section types
  getSectionTypes() {
    return Object.values(ExerciseSectionType);
  }

  // ==================== QUESTION METHODS ====================

  async createQuestion(dto: CreateQuestionDto): Promise<Question> {
    // Verify section exists
    const section = await this.sectionRepository.findOne({ where: { id: dto.sectionId } });
    if (!section) {
      throw new NotFoundException('Không tìm thấy phần học');
    }

    const question = this.questionRepository.create({
      sectionId: dto.sectionId,
      questionType: dto.questionType,
      questionText: dto.questionText,
      difficulty: dto.difficulty,
      points: dto.points || 1,
      orderIndex: dto.orderIndex || 0,
      options: dto.options || null,
      answer: dto.answer || null,
      explanation: dto.explanation || null,
      audioUrl: dto.audioUrl || null,
      videoUrl: dto.videoUrl || null,
      imageUrl: dto.imageUrl || null,
      passage: dto.passage || null,
      transcript: dto.transcript || null,
      word: dto.word || null,
      pronunciation: dto.pronunciation || null,
      definition: dto.definition || null,
      examples: dto.examples || null,
      wordBank: dto.wordBank || null,
      correctWordIds: dto.correctWordIds || null,
      grammarTopic: dto.grammarTopic || null,
      rubric: dto.rubric || null,
      evaluationCriteria: dto.evaluationCriteria || null,
      hints: dto.hints || null,
      sampleAnswer: dto.sampleAnswer || null,
      topicArea: dto.topicArea || null,
      status: Status.ACTIVE,
    });

    const savedQuestion = await this.questionRepository.save(question);

    // Update section total points
    await this.updateSectionTotalPoints(dto.sectionId);

    return savedQuestion;
  }

  async createBulkQuestions(questions: CreateQuestionDto[]): Promise<Question[]> {
    const savedQuestions: Question[] = [];

    for (const dto of questions) {
      const question = await this.createQuestion(dto);
      savedQuestions.push(question);
    }

    return savedQuestions;
  }

  async findAllQuestions(): Promise<Question[]> {
    return await this.questionRepository.find({
      relations: ['section'],
      order: { orderIndex: 'ASC' },
    });
  }

  async findQuestionsBySection(sectionId: string): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { sectionId },
      order: { orderIndex: 'ASC' },
    });
  }

  async findQuestionById(id: string): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['section'],
    });

    if (!question) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }

    return question;
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto): Promise<Question> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }

    const oldPoints = question.points;
    Object.assign(question, dto);
    const savedQuestion = await this.questionRepository.save(question);

    // Update section total points if points changed
    if (dto.points !== undefined && dto.points !== oldPoints) {
      await this.updateSectionTotalPoints(question.sectionId);
    }

    return savedQuestion;
  }

  async deleteQuestion(id: string): Promise<void> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question) {
      throw new NotFoundException('Không tìm thấy câu hỏi');
    }

    const sectionId = question.sectionId;
    await this.questionRepository.remove(question);

    // Update section total points
    await this.updateSectionTotalPoints(sectionId);
  }

  // Helper method to update section total points
  private async updateSectionTotalPoints(sectionId: string): Promise<void> {
    const questions = await this.questionRepository.find({
      where: { sectionId, status: Status.ACTIVE },
    });

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    await this.sectionRepository.update(sectionId, { totalPoints });
  }

  // ==================== COMBINED METHODS ====================

  // Get full lesson exercise data
  async getLessonExercises(lessonId: string): Promise<any> {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
      relations: ['course', 'class'],
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    const sections = await this.sectionRepository.find({
      where: { lessonId },
      order: { orderIndex: 'ASC' },
    });

    const sectionsWithQuestions = await Promise.all(
      sections.map(async (section) => {
        const questions = await this.questionRepository.find({
          where: { sectionId: section.id },
          order: { orderIndex: 'ASC' },
        });
        return {
          ...section,
          questions,
        };
      }),
    );

    return {
      lesson,
      sections: sectionsWithQuestions,
      totalSections: sections.length,
      totalQuestions: sectionsWithQuestions.reduce((sum, s) => sum + s.questions.length, 0),
      totalPoints: sectionsWithQuestions.reduce((sum, s) => sum + s.totalPoints, 0),
    };
  }
}
