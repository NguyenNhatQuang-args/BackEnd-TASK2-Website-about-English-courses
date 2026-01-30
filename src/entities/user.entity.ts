import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { config } from '../config';
import { UserRole, Status } from './enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fullname!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string | null;

  @Column({ type: 'date', name: 'date_of_birth', nullable: true })
  dateOfBirth!: Date | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status!: Status;

  @Column({ type: 'text', default: '' })
  permissions!: string; // Comma-separated permission names

  @Column({ type: 'text', name: 'avatar_url', nullable: true })
  avatarUrl!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  // Flag to track if password needs hashing
  private tempPassword?: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert(): Promise<void> {
    if (this.password) {
      const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeUpdate()
  async hashPasswordBeforeUpdate(): Promise<void> {
    if (this.tempPassword) {
      const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
      this.password = await bcrypt.hash(this.tempPassword, salt);
      this.tempPassword = undefined;
    }
  }

  // Method to set new password (will be hashed on update)
  setPassword(newPassword: string): void {
    this.tempPassword = newPassword;
    this.password = newPassword; // Will be hashed in BeforeUpdate
  }

  // Compare password method
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
