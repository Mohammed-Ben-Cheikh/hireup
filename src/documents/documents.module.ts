import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesGuard } from '../common/guards/roles.guard';
import { CandidatesModule } from '../candidates/candidates.module';
import { CandidateDocumentsController } from './candidate-documents.controller';
import { Document } from './document.entity';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { MinioService } from './minio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), CandidatesModule],
  controllers: [DocumentsController, CandidateDocumentsController],
  providers: [DocumentsService, MinioService, RolesGuard],
  exports: [DocumentsService],
})
export class DocumentsModule {}
