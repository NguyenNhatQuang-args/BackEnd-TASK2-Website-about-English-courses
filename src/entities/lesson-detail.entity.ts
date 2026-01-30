import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('lesson_details')
export class LessonDetail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'lesson_id' })
  lessonId!: string;

  @ManyToOne(() => Lesson, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson!: Lesson;

  @Column({ type: 'varchar', length: 50, name: 'content_type' })
  contentType!: string; // 'text', 'video', 'audio', 'document', 'quiz'

  @Column({ type: 'varchar', length: 255, nullable: true })
  title!: string | null;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @Column({ type: 'text', name: 'video_url', nullable: true })
  videoUrl!: string | null;

  @Column({ type: 'text', name: 'audio_url', nullable: true })
  audioUrl!: string | null;

  @Column({ type: 'text', name: 'document_url', nullable: true })
  documentUrl!: string | null;

  @Column({ type: 'integer', name: 'order_index', default: 0 })
  orderIndex!: number;

  @Column({ type: 'integer', name: 'duration_seconds', nullable: true })
  durationSeconds!: number | null;

  @Column({ type: 'boolean', name: 'is_required', default: true })
  isRequired!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
