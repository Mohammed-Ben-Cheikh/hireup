import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CandidatesService } from '../candidates/candidates.service';
import { NotificationType } from '../notifications/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Interview, InterviewStatus } from './interview.entity';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewsRepo: Repository<Interview>,
    private readonly candidatesService: CandidatesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    orgId: string,
    data: { candidateId: string; scheduledAt: Date; participants: string[] },
  ) {
    await this.candidatesService.findById(orgId, data.candidateId);
    const interview = this.interviewsRepo.create({
      orgId,
      candidateId: data.candidateId,
      scheduledAt: data.scheduledAt,
      participants: data.participants,
      status: InterviewStatus.SCHEDULED,
    });
    const saved = await this.interviewsRepo.save(interview);

    await this.notificationsService.notify({
      orgId,
      type: NotificationType.INTERVIEW_CREATED,
      message: `Interview scheduled for candidate ${data.candidateId}`,
      targetRole: 'rh',
      metadata: { interviewId: saved.id, candidateId: data.candidateId },
    });

    return saved;
  }

  async findById(orgId: string, id: string) {
    const interview = await this.interviewsRepo.findOne({
      where: { id, orgId },
    });
    if (!interview) {
      throw new NotFoundException('Interview not found');
    }
    return interview;
  }

  async update(
    orgId: string,
    id: string,
    data: { scheduledAt?: Date; participants?: string[] },
  ) {
    await this.findById(orgId, id);
    await this.interviewsRepo.update(id, {
      scheduledAt: data.scheduledAt,
      participants: data.participants,
    });
    const updated = await this.findById(orgId, id);

    await this.notificationsService.notify({
      orgId,
      type: NotificationType.INTERVIEW_UPDATED,
      message: `Interview updated ${id}`,
      targetRole: 'rh',
      metadata: { interviewId: id },
    });

    return updated;
  }

  async cancel(orgId: string, id: string) {
    await this.findById(orgId, id);
    await this.interviewsRepo.update(id, { status: InterviewStatus.CANCELED });
    const canceled = await this.findById(orgId, id);

    await this.notificationsService.notify({
      orgId,
      type: NotificationType.INTERVIEW_CANCELED,
      message: `Interview canceled ${id}`,
      targetRole: 'rh',
      metadata: { interviewId: id },
    });

    return canceled;
  }

  async list(orgId: string, dateFrom?: Date, dateTo?: Date) {
    const qb = this.interviewsRepo
      .createQueryBuilder('interview')
      .where('interview.orgId = :orgId', { orgId });

    if (dateFrom) {
      qb.andWhere('interview.scheduledAt >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      qb.andWhere('interview.scheduledAt <= :dateTo', { dateTo });
    }

    return qb.orderBy('interview.scheduledAt', 'ASC').getMany();
  }
}
