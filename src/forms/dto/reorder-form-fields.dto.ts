import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

class FormFieldOrderItemDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  order: number;
}

export class ReorderFormFieldsDto {
  @ApiProperty({ type: [FormFieldOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldOrderItemDto)
  items: FormFieldOrderItemDto[];
}
