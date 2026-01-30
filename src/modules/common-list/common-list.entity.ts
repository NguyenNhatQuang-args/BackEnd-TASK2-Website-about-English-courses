import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

// Enum định nghĩa các loại dữ liệu dùng chung
export enum CommonListType {
  KIND_OF_COURSE = 'KIND_OF_COURSE', // IELTS, TOEIC, 4SKILL
  LEVEL = 'LEVEL',                   // S, Pres, TC, MTC, FI, EF, TE, ME
  ROLE = 'ROLE',                     // ADMIN, USER, TEACHER
}

@Entity('common_lists')
@Unique(['type', 'code']) // Đảm bảo code unique trong mỗi type
export class CommonList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CommonListType,
  })
  type: CommonListType;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  order: number; // Thứ tự hiển thị

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
