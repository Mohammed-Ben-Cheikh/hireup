import { Body, Controller, NotFoundException, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { OrganizationsService } from '../organizations/organizations.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN_RH)
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        role: 'rh',
        orgId: 'uuid',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      },
    },
  })
  async create(@Body() payload: CreateUserDto) {
    const org = await this.organizationsService.findById(payload.orgId);
    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return this.usersService.createWithPassword({
      email: payload.email,
      password: payload.password,
      role: payload.role,
      orgId: payload.orgId,
    });
  }
}
