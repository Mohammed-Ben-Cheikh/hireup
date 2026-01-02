import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';
import { CandidatesModule } from './candidates/candidates.module';
import { DocumentsModule } from './documents/documents.module';
import { FormsModule } from './forms/forms.module';
import { InterviewsModule } from './interviews/interviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
        DATABASE_URL: Joi.string().required(),
        MINIO_ENDPOINT: Joi.string().required(),
        MINIO_PORT: Joi.number().required(),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_BUCKET: Joi.string().default('gedpro'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        logging: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    UsersModule,
    AuthModule,
    OrganizationsModule,
    FormsModule,
    CandidatesModule,
    DocumentsModule,
    InterviewsModule,
    NotificationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
