import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user.entity';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { FormsService } from './forms.service';

@ApiTags('forms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN_RH, UserRole.RH)
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post()
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        orgId: 'uuid',
        title: 'Formulaire de recrutement',
        description: 'Candidature développeur backend.',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    },
  })
  create(
    @Body() payload: CreateFormDto,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService.create(req.user.orgId, payload);
  }

  @Get()
  @ApiOkResponse({ schema: { example: [] } })
  list(@Req() req: { user: { orgId: string | null } }) {
    if (!req.user.orgId) {
      return [];
    }

    return this.formsService.findAll(req.user.orgId);
  }

  @Get(':id')
  get(
    @Param('id') id: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService.findOne(req.user.orgId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateFormDto,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService.update(req.user.orgId, id, payload);
  }

  @Patch(':id/publish')
  publish(
    @Param('id') id: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService.publish(req.user.orgId, id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService.remove(req.user.orgId, id);
  }
}
