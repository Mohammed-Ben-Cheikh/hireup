import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormsService } from '../forms/forms.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notification.entity';
import { Candidate, CandidateStatus } from './candidate.entity';
import { CandidateStatusHistory } from './candidate-status-history.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidatesRepo: Repository<Candidate>,
    @InjectRepository(CandidateStatusHistory)
    private readonly historyRepo: Repository<CandidateStatusHistory>,
    private readonly formsService: FormsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async submit(publicId: string, data: Record<string, unknown>) {
    const form = await this.formsService.findPublishedByPublicId(publicId);

    const missing = form.fields.filter((field) => {
      if (!field.required) {
        return false;
      }
      const value = data?.[field.id];
      return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
      throw new BadRequestException('Missing required fields');
    }

    const candidate = this.candidatesRepo.create({
      orgId: form.orgId,
      formId: form.id,
      data,
      status: CandidateStatus.NOUVEAU,
    });

    const saved = await this.candidatesRepo.save(candidate);

    await this.notificationsService.notify({
      orgId: saved.orgId,
      type: NotificationType.CANDIDATE_SUBMITTED,
      message: `New candidate submitted for form ${form.title}`,
      targetRole: 'rh',
      metadata: { candidateId: saved.id, formId: form.id },
    });

    return saved;
  }

  async findById(orgId: string, id: string) {
    const candidate = await this.candidatesRepo.findOne({
      where: { id, orgId },
    });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }
    return candidate;
  }

  async updateStatus(
    orgId: string,
    id: string,
    status: CandidateStatus,
    changedBy: string,
  ) {
    const candidate = await this.findById(orgId, id);
    if (candidate.status === status) {
      return candidate;
    }

    const fromStatus = candidate.status;
    candidate.status = status;
    const saved = await this.candidatesRepo.save(candidate);

    await this.historyRepo.save(
      this.historyRepo.create({
        orgId,
        candidateId: candidate.id,
        fromStatus,
        toStatus: status,
        changedBy,
      }),
    );

    await this.notificationsService.notify({
      orgId,
      type: NotificationType.CANDIDATE_STATUS_CHANGED,
      message: `Candidate status changed to ${status}`,
      targetRole: 'manager',
      metadata: { candidateId: candidate.id, fromStatus, toStatus: status },
    });

    return saved;
  }

  async getHistory(orgId: string, candidateId: string) {
    await this.findById(orgId, candidateId);
    return this.historyRepo.find({
      where: { orgId, candidateId },
      order: { changedAt: 'DESC' },
    });
  }
}
