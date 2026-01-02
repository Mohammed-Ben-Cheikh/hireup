import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({ example: 'candidate-uuid' })
  @IsUUID()
  candidateId: string;
}
