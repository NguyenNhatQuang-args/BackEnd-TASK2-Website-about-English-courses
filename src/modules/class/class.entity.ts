import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CourseLevel, CourseKind } from './enums';
import { Lesson } from '../lessons/lessons.entity'; // Thêm chữ 's' ở đây

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  className: string;

  @Column({ unique: true })
  classCode: string;

  @Column({ type: 'enum', enum: CourseLevel })
  level: CourseLevel;

  @Column({ type: 'enum', enum: CourseKind })
  kindOfCourse: CourseKind;

  @ManyToMany(() => User)
  @JoinTable({ name: 'class_students' })
  students: User[];

  @OneToMany(() => Lesson, (lesson: Lesson) => lesson.class)
  lessons: Lesson[];
}