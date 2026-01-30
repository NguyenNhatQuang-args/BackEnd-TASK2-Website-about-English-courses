import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExerciseSection } from './exercise-section.entity';
import { QuestionType, DifficultyLevel, Status } from './enums';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'section_id' })
  sectionId!: string;

  @ManyToOne(() => ExerciseSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section!: ExerciseSection;

  @Column({
    type: 'enum',
    enum: QuestionType,
    name: 'question_type',
  })
  questionType!: QuestionType;

  @Column({ type: 'text', name: 'question_text' })
  questionText!: string;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.MEDIUM,
  })
  difficulty!: DifficultyLevel;

  @Column({ type: 'integer', default: 1 })
  points!: number;

  @Column({ type: 'integer', name: 'order_index', default: 0 })
  orderIndex!: number;

  // JSON fields for flexible question data
  @Column({ type: 'jsonb', nullable: true })
  options!: string[] | null; // For multiple choice, match, etc.

  @Column({ type: 'jsonb', nullable: true })
  answer!: string | string[] | null; // Correct answer(s)

  @Column({ type: 'text', nullable: true })
  explanation!: string | null;

  // Additional content fields
  @Column({ type: 'text', name: 'audio_url', nullable: true })
  audioUrl!: string | null; // For listening questions

  @Column({ type: 'text', name: 'video_url', nullable: true })
  videoUrl!: string | null; // For video grammar questions

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imageUrl!: string | null; // For vocab or visual questions

  @Column({ type: 'text', nullable: true })
  passage!: string | null; // For reading questions

  @Column({ type: 'text', nullable: true })
  transcript!: string | null; // For listening transcript

  // Word/Vocab specific fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  word!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pronunciation!: string | null;

  @Column({ type: 'text', nullable: true })
  definition!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  examples!: string[] | null;

  // Word Bank specific
  @Column({ type: 'jsonb', name: 'word_bank', nullable: true })
  wordBank!: { id: string | number; name: string }[] | null;

  @Column({ type: 'jsonb', name: 'correct_word_ids', nullable: true })
  correctWordIds!: (string | number)[] | null;

  // Grammar specific
  @Column({ type: 'varchar', length: 255, name: 'grammar_topic', nullable: true })
  grammarTopic!: string | null;

  // Writing rubric
  @Column({ type: 'jsonb', nullable: true })
  rubric!: {
    grammar?: number;
    vocabulary?: number;
    coherence?: number;
    total?: number;
  } | null;

  // Speaking evaluation criteria
  @Column({ type: 'jsonb', name: 'evaluation_criteria', nullable: true })
  evaluationCriteria!: {
    pronunciation?: number;
    fluency?: number;
    grammar?: number;
    vocabulary?: number;
    total?: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  hints!: string[] | null; // For writing prompts

  @Column({ type: 'text', name: 'sample_answer', nullable: true })
  sampleAnswer!: string | null; // For writing/speaking

  @Column({ type: 'varchar', length: 255, name: 'topic_area', nullable: true })
  topicArea!: string | null; // For speaking

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status!: Status;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
