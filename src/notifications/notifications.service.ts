import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification, NotificationType } from './notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async notify(params: {
    orgId: string;
    type: NotificationType;
    message: string;
    targetRole?: string | null;
    metadata?: Record<string, unknown>;
  }) {
    const notification = this.notificationsRepo.create({
      orgId: params.orgId,
      type: params.type,
      message: params.message,
      targetRole: params.targetRole ?? null,
      metadata: params.metadata ?? null,
      readAt: null,
    });
    const saved = await this.notificationsRepo.save(notification);
    this.notificationsGateway.emitNotification(
      saved.orgId,
      saved.targetRole,
      saved,
    );
    return saved;
  }

  async listForUser(
    orgId: string,
    role: string,
    unreadOnly?: boolean,
  ) {
    const qb = this.notificationsRepo
      .createQueryBuilder('notification')
      .where('notification.orgId = :orgId', { orgId })
      .andWhere(
        '(notification.targetRole IS NULL OR notification.targetRole = :role)',
        { role },
      )
      .orderBy('notification.createdAt', 'DESC');

    if (unreadOnly) {
      qb.andWhere('notification.readAt IS NULL');
    }

    return qb.getMany();
  }

  async markAsRead(orgId: string, id: string) {
    const notification = await this.notificationsRepo.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    if (notification.orgId !== orgId) {
      throw new NotFoundException('Notification not found');
    }
    notification.readAt = new Date();
    return this.notificationsRepo.save(notification);
  }
}
