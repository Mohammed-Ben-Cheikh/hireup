import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
