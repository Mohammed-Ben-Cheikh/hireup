import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { FormFieldType } from '../form-field.entity';

export class CreateFormFieldDto {
  @ApiProperty({ enum: FormFieldType, example: FormFieldType.TEXT })
  @IsEnum(FormFieldType)
  type: FormFieldType;

  @ApiProperty({ example: 'Nom complet' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  required: boolean;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  order: number;
}
