import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { InterviewsModule } from './interviews/interviews.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { CandidatesModule } from './candidates/candidates.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'StrongPassword123!',
      database: 'hireup',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/hireup'),
    UsersModule,
    AuthModule,
    InterviewsModule,
    OrganizationsModule,
    CandidatesModule,
    RolesModule,
  ],
})
export class AppModule {}
