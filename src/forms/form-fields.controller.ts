import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user.entity';
import { CreateFormFieldDto } from './dto/create-form-field.dto';
import { ReorderFormFieldsDto } from './dto/reorder-form-fields.dto';
import { UpdateFormFieldDto } from './dto/update-form-field.dto';
import { FormFieldsService } from './form-fields.service';
import { FormsService } from './forms.service';

@ApiTags('form-fields')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN_RH, UserRole.RH)
@Controller('forms/:formId/fields')
export class FormFieldsController {
  constructor(
    private readonly formFieldsService: FormFieldsService,
    private readonly formsService: FormsService,
  ) {}

  @Get()
  list(
    @Param('formId') formId: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService
      .findOne(req.user.orgId, formId)
      .then(() => this.formFieldsService.list(formId));
  }

  @Post()
  @ApiOkResponse({ schema: { example: { id: 'uuid' } } })
  create(
    @Param('formId') formId: string,
    @Body() payload: CreateFormFieldDto,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService
      .findOne(req.user.orgId, formId)
      .then(() => this.formFieldsService.create(formId, payload));
  }

  @Patch(':fieldId')
  update(
    @Param('formId') formId: string,
    @Param('fieldId') fieldId: string,
    @Body() payload: UpdateFormFieldDto,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService
      .findOne(req.user.orgId, formId)
      .then(() => this.formFieldsService.update(formId, fieldId, payload));
  }

  @Delete(':fieldId')
  remove(
    @Param('formId') formId: string,
    @Param('fieldId') fieldId: string,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService
      .findOne(req.user.orgId, formId)
      .then(() => this.formFieldsService.remove(formId, fieldId));
  }

  @Put('reorder')
  reorder(
    @Param('formId') formId: string,
    @Body() payload: ReorderFormFieldsDto,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.formsService
      .findOne(req.user.orgId, formId)
      .then(() => this.formFieldsService.reorder(formId, payload.items));
  }
}
