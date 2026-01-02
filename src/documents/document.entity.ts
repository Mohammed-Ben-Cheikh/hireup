import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('documents')
@Index('IDX_DOCUMENT_ORG', ['orgId'])
@Index('IDX_DOCUMENT_CANDIDATE', ['candidateId'])
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  candidateId: string;

  @Column({ type: 'uuid' })
  orgId: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 255 })
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'varchar', length: 255 })
  objectKey: string;

  @CreateDateColumn()
  createdAt: Date;
}
