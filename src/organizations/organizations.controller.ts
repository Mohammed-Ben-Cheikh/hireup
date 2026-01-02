import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly organizationsService: OrganizationsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN_RH)
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        name: 'Acme Corp',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    },
  })
  async create(
    @Body() payload: CreateOrganizationDto,
    @Req()
    req: { user: { userId: string; orgId: string | null } },
  ) {
    const organization = await this.organizationsService.create(payload.name);

    if (!req.user.orgId) {
      await this.usersService.assignOrg(req.user.userId, organization.id);
    }

    return organization;
  }

  @Get()
  @ApiOkResponse({
    schema: {
      example: [
        {
          id: 'uuid',
          name: 'Acme Corp',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  list() {
    return this.organizationsService.findAll();
  }
}
