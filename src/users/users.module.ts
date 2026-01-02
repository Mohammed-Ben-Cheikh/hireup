import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesGuard } from '../common/guards/roles.guard';
import { OrganizationsModule } from '../organizations/organizations.module';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => OrganizationsModule)],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
