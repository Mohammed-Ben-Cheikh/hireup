import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CandidatesService } from './candidates.service';
import { SubmitCandidateDto } from './dto/submit-candidate.dto';

@ApiTags('public-candidates')
@Controller('public/forms/:publicId/submissions')
export class PublicCandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        formId: 'uuid',
        orgId: 'uuid',
        status: 'NOUVEAU',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    },
  })
  submit(
    @Body() payload: SubmitCandidateDto,
    @Param('publicId') publicId: string,
  ) {
    return this.candidatesService.submit(publicId, payload.data);
  }
}
