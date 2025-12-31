import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(registerAuthDto: RegisterAuthDto): Promise<{ token: string }> {
    const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);

    const user = this.userRepository.create({
      ...registerAuthDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return {
      token: this.jwtService.sign({ sub: user.id }),
    };
  }

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
