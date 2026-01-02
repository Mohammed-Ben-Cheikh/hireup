import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOkResponse({ schema: { example: [] } })
  list(
    @Req() req: { user: { orgId: string | null; role: string } },
    @Query('unread') unread?: string,
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }
    return this.notificationsService.listForUser(
      req.user.orgId,
      req.user.role,
      unread === 'true',
    );
  }

  @Patch(':id/read')
  markRead(
    @Param('id') id: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }
    return this.notificationsService.markAsRead(req.user.orgId, id);
  }
}
