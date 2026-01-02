import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { InterviewsService } from './interviews.service';

@ApiTags('interviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        candidateId: 'uuid',
        participants: ['rh@example.com'],
        status: 'SCHEDULED',
      },
    },
  })
  create(
    @Body() payload: CreateInterviewDto,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.interviewsService.create(req.user.orgId, {
      candidateId: payload.candidateId,
      scheduledAt: new Date(payload.scheduledAt),
      participants: payload.participants,
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateInterviewDto,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.interviewsService.update(req.user.orgId, id, {
      scheduledAt: payload.scheduledAt
        ? new Date(payload.scheduledAt)
        : undefined,
      participants: payload.participants,
    });
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.interviewsService.cancel(req.user.orgId, id);
  }

  @Get()
  @ApiOkResponse({ schema: { example: [] } })
  list(
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      return [];
    }

    return this.interviewsService.list(
      req.user.orgId,
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }
}
