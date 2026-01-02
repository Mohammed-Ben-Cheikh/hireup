import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsEmail, IsUUID } from 'class-validator';

export class CreateInterviewDto {
  @ApiProperty({ example: 'candidate-uuid' })
  @IsUUID()
  candidateId: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: ['rh@example.com', 'manager@example.com'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  participants: string[];
}
