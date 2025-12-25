import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  register() {}

  async login(loginAuthDto: LoginAuthDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(loginAuthDto.email);

    if (user?.password !== loginAuthDto.password) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roules: user.roles,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
