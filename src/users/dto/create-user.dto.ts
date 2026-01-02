import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';

import { UserRole } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.RH })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'e9c4c19e-1f77-4e0f-9b2b-0d8f1d4e3d3d' })
  @IsUUID()
  orgId: string;
}
