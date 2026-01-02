import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(data: {
    email: string;
    passwordHash: string;
    role?: UserRole;
    orgId?: string | null;
  }): Promise<User> {
    const user = this.usersRepo.create({
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role ?? UserRole.RH,
      orgId: data.orgId ?? null,
    });
    return this.usersRepo.save(user);
  }

  async createWithPassword(data: {
    email: string;
    password: string;
    role?: UserRole;
    orgId?: string | null;
  }): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.create({
      email: data.email,
      passwordHash,
      role: data.role,
      orgId: data.orgId ?? null,
    });
  }

  async assignOrg(userId: string, orgId: string): Promise<User | null> {
    await this.usersRepo.update(userId, { orgId });
    return this.findById(userId);
  }
}
