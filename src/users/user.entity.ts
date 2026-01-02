import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN_RH = 'adminRH',
  RH = 'rh',
  MANAGER = 'manager',
}

@Entity('users')
@Index('IDX_USERS_EMAIL', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RH })
  role: UserRole;

  @Column({ type: 'uuid', nullable: true })
  orgId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
