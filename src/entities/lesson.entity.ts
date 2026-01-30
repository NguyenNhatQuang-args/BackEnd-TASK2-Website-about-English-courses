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
import { User } from './user.entity';
import { Course } from './course.entity';
import { Class } from './class.entity';
import { Status } from './enums';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'uuid', name: 'course_id', nullable: true })
  courseId!: string | null;

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: Course | null;

  @Column({ type: 'uuid', name: 'class_id', nullable: true })
  classId!: string | null;

  @ManyToOne(() => Class, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'class_id' })
  class!: Class | null;

  @Column({ type: 'integer', name: 'order_index', default: 0 })
  orderIndex!: number;

  @Column({ type: 'integer', name: 'duration_minutes', nullable: true })
  durationMinutes!: number | null;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status!: Status;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy!: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator!: User | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
