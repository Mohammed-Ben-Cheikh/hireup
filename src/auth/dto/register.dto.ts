import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.RH })
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ example: 'e9c4c19e-1f77-4e0f-9b2b-0d8f1d4e3d3d' })
  @IsOptional()
  @IsUUID()
  orgId?: string;
}
