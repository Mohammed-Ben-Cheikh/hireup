import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CandidateStatus {
  NOUVEAU = 'NOUVEAU',
  PRESELECTIONNE = 'PRESELECTIONNE',
  ENTRETIEN_PLANIFIE = 'ENTRETIEN_PLANIFIE',
  EN_ENTRETIEN = 'EN_ENTRETIEN',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
}

@Entity('candidates')
@Index('IDX_CANDIDATE_ORG', ['orgId'])
@Index('IDX_CANDIDATE_FORM', ['formId'])
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orgId: string;

  @Column({ type: 'uuid' })
  formId: string;

  @Column({ type: 'jsonb' })
  data: Record<string, unknown>;

  @Column({ type: 'enum', enum: CandidateStatus, default: CandidateStatus.NOUVEAU })
  status: CandidateStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
