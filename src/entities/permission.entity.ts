import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './enums';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ type: 'text', default: '' })
  roles!: string; // Comma-separated roles: 'ADMIN,TEACHER,STUDENT'

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  // Helper methods
  getRolesArray(): UserRole[] {
    if (!this.roles) return [];
    return this.roles.split(',').filter(r => r) as UserRole[];
  }

  setRolesFromArray(roles: UserRole[]): void {
    this.roles = roles.join(',');
  }

  hasRole(role: UserRole): boolean {
    return this.getRolesArray().includes(role);
  }
}
