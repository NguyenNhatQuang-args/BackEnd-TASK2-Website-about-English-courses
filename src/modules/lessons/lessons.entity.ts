import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Class } from '../class/class.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Class, (classroom: Class) => classroom.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;
}