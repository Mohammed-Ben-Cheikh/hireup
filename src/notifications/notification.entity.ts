import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NotificationType {
  CANDIDATE_SUBMITTED = 'CANDIDATE_SUBMITTED',
  CANDIDATE_STATUS_CHANGED = 'CANDIDATE_STATUS_CHANGED',
  INTERVIEW_CREATED = 'INTERVIEW_CREATED',
  INTERVIEW_UPDATED = 'INTERVIEW_UPDATED',
  INTERVIEW_CANCELED = 'INTERVIEW_CANCELED',
}

@Entity('notifications')
@Index('IDX_NOTIFICATION_ORG', ['orgId'])
@Index('IDX_NOTIFICATION_ROLE', ['targetRole'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orgId: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'varchar', length: 500 })
  message: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  targetRole: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
