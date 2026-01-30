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
import { CourseLevel, CourseKind, Status } from './enums';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 50, name: 'class_code', unique: true, nullable: true })
  classCode!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'uuid', name: 'course_id', nullable: true })
  courseId!: string | null;

  @ManyToOne(() => Course, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'course_id' })
  course!: Course | null;

  @Column({ type: 'uuid', name: 'teacher_id', nullable: true })
  teacherId!: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teacher_id' })
  teacher!: User | null;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    nullable: true,
  })
  level!: CourseLevel | null;

  @Column({
    type: 'enum',
    enum: CourseKind,
    nullable: true,
  })
  kind!: CourseKind | null;

  @Column({ type: 'integer', name: 'max_students', default: 30 })
  maxStudents!: number;

  @Column({ type: 'date', name: 'start_date', nullable: true })
  startDate!: Date | null;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate!: Date | null;

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
