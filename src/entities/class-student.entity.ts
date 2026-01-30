import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Class } from './class.entity';
import { Status } from './enums';

@Entity('class_students')
@Unique(['classId', 'studentId'])
export class ClassStudent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'class_id' })
  classId!: string;

  @ManyToOne(() => Class, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class!: Class;

  @Column({ type: 'uuid', name: 'student_id' })
  studentId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student!: User;

  @CreateDateColumn({ name: 'enrolled_at', type: 'timestamptz' })
  enrolledAt!: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status!: Status;
}
