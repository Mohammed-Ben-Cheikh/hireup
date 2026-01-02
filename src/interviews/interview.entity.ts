import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELED = 'CANCELED',
}

@Entity('interviews')
@Index('IDX_INTERVIEW_ORG', ['orgId'])
@Index('IDX_INTERVIEW_CANDIDATE', ['candidateId'])
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orgId: string;

  @Column({ type: 'uuid' })
  candidateId: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'jsonb' })
  participants: string[];

  @Column({ type: 'enum', enum: InterviewStatus, default: InterviewStatus.SCHEDULED })
  status: InterviewStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
