import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FormField } from './form-field.entity';

export enum FormStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('forms')
@Index('IDX_FORM_ORG', ['orgId'])
export class Form {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orgId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'enum', enum: FormStatus, default: FormStatus.DRAFT })
  status: FormStatus;

  @Column({ type: 'varchar', length: 64, unique: true, nullable: true })
  publicId: string | null;

  @OneToMany(() => FormField, (field) => field.form)
  fields: FormField[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
