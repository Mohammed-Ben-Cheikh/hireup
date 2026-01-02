import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class SubmitCandidateDto {
  @ApiProperty({
    example: {
      fieldId: 'value',
    },
  })
  @IsObject()
  data: Record<string, unknown>;
}
