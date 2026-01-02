import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { FormFieldType } from '../form-field.entity';

export class UpdateFormFieldDto {
  @ApiPropertyOptional({ enum: FormFieldType })
  @IsEnum(FormFieldType)
  @IsOptional()
  type?: FormFieldType;

  @ApiPropertyOptional({ example: 'Nom complet' })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}
