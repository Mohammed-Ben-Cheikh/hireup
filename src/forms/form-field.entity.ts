import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Form } from './form.entity';

export enum FormFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  FILE = 'file',
}

@Entity('form_fields')
@Index('IDX_FORM_FIELD_FORM', ['formId'])
export class FormField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  formId: string;

  @ManyToOne(() => Form, { onDelete: 'CASCADE' })
  form: Form;

  @Column({ type: 'enum', enum: FormFieldType })
  type: FormFieldType;

  @Column({ type: 'varchar', length: 255 })
  label: string;

  @Column({ type: 'boolean', default: false })
  required: boolean;

  @Column({ type: 'int' })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
