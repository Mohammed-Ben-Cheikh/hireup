import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFormDto {
  @ApiPropertyOptional({ example: 'Formulaire de recrutement v2' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Description mise à jour.' })
  @IsString()
  @IsOptional()
  description?: string;
}
