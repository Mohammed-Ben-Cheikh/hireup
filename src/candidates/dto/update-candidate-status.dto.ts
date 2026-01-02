import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { CandidateStatus } from '../candidate.entity';

export class UpdateCandidateStatusDto {
  @ApiProperty({ enum: CandidateStatus, example: CandidateStatus.PRESELECTIONNE })
  @IsEnum(CandidateStatus)
  status: CandidateStatus;
}
