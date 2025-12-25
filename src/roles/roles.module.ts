import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleSeed } from './roles.seed';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, RoleSeed],
  exports: [RolesService],
})
export class RolesModule {}
