import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CandidateStatus } from './candidate.entity';

@Entity('candidate_status_history')
@Index('IDX_CAND_HISTORY_ORG', ['orgId'])
@Index('IDX_CAND_HISTORY_CAND', ['candidateId'])
export class CandidateStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orgId: string;

  @Column({ type: 'uuid' })
  candidateId: string;

  @Column({ type: 'enum', enum: CandidateStatus })
  fromStatus: CandidateStatus;

  @Column({ type: 'enum', enum: CandidateStatus })
  toStatus: CandidateStatus;

  @Column({ type: 'uuid' })
  changedBy: string;

  @CreateDateColumn()
  changedAt: Date;
}
