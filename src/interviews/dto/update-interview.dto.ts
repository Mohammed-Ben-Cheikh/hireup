import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UpdateInterviewDto {
  @ApiPropertyOptional({ example: '2025-01-01T10:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional({ example: ['rh@example.com'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  @IsOptional()
  participants?: string[];
}
