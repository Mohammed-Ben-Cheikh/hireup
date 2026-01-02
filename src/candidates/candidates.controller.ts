import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user.entity';
import { CandidatesService } from './candidates.service';
import { UpdateCandidateStatusDto } from './dto/update-candidate-status.dto';

@ApiTags('candidates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN_RH, UserRole.RH, UserRole.MANAGER)
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        status: 'PRESELECTIONNE',
      },
    },
  })
  updateStatus(
    @Param('id') id: string,
    @Body() payload: UpdateCandidateStatusDto,
    @Req() req: { user: { orgId: string | null; userId: string } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.candidatesService.updateStatus(
      req.user.orgId,
      id,
      payload.status,
      req.user.userId,
    );
  }

  @Get(':id/history')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN_RH, UserRole.RH, UserRole.MANAGER)
  @ApiOkResponse({ schema: { example: [] } })
  history(
    @Param('id') id: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.candidatesService.getHistory(req.user.orgId, id);
  }
}
