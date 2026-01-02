import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService, AuthTokenResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    schema: {
      example: {
        access_token: 'jwt-token',
        user: {
          id: 'uuid',
          email: 'user@example.com',
          role: 'rh',
          orgId: null,
        },
      },
    },
  })
  register(@Body() payload: RegisterDto): Promise<AuthTokenResponse> {
    return this.authService.register(payload);
  }

  @Post('login')
  @ApiOkResponse({
    schema: {
      example: {
        access_token: 'jwt-token',
        user: {
          id: 'uuid',
          email: 'user@example.com',
          role: 'rh',
          orgId: null,
        },
      },
    },
  })
  login(@Body() payload: LoginDto): Promise<AuthTokenResponse> {
    return this.authService.login(payload);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    schema: {
      example: { userId: 'uuid', role: 'rh', orgId: null },
    },
  })
  me(@Req() req: { user: { userId: string; role: string; orgId: string | null } }) {
    return req.user;
  }
}
