import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { ExerciseSectionType, Status } from './enums';

@Entity('exercise_sections')
export class ExerciseSection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'lesson_id' })
  lessonId!: string;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson!: Lesson;

  @Column({
    type: 'enum',
    enum: ExerciseSectionType,
    name: 'section_type',
  })
  sectionType!: ExerciseSectionType;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'integer', name: 'order_index', default: 0 })
  orderIndex!: number;

  @Column({ type: 'integer', name: 'total_points', default: 0 })
  totalPoints!: number;

  @Column({ type: 'integer', name: 'estimated_time', default: 0 })
  estimatedTime!: number; // in minutes

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
