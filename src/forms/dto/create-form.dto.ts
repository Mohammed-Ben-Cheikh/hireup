import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFormDto {
  @ApiProperty({ example: 'Formulaire de recrutement' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Candidature développeur backend.' })
  @IsString()
  @IsOptional()
  description?: string;
}
