import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidatesModule } from '../candidates/candidates.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { Interview } from './interview.entity';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Interview]),
    CandidatesModule,
    NotificationsModule,
  ],
  controllers: [InterviewsController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
