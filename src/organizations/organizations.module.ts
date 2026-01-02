import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { RolesGuard } from '../common/guards/roles.guard';
import { Organization } from './organization.entity';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization]), forwardRef(() => UsersModule)],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, RolesGuard],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
