import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface AuthTokenResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    orgId: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto): Promise<AuthTokenResponse> {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const user = await this.usersService.create({
      email: payload.email,
      passwordHash,
      role: payload.role,
      orgId: payload.orgId ?? null,
    });

    return this.issueToken(user);
  }

  async login(payload: LoginDto): Promise<AuthTokenResponse> {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueToken(user);
  }

  private issueToken(user: User): AuthTokenResponse {
    const access_token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
      orgId: user.orgId,
    });

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
      },
    };
  }
}
