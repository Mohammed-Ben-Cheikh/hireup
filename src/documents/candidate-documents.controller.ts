import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('candidates')
export class CandidateDocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':id/documents')
  @ApiOkResponse({
    schema: {
      example: {
        items: [],
        page: 1,
        limit: 20,
        total: 0,
      },
    },
  })
  list(
    @Req() req: { user: { orgId: string | null } },
    @Param('id') candidateId: string,
    @Query('type') type?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (!req.user.orgId) {
      return { items: [], page: 1, limit: 20, total: 0 };
    }

    return this.documentsService.listByCandidate({
      orgId: req.user.orgId,
      candidateId,
      type,
      order,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
