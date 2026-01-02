import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Organization } from './organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async create(name: string): Promise<Organization> {
    const existing = await this.orgRepo.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException('Organization name already exists');
    }

    const organization = this.orgRepo.create({ name });
    return this.orgRepo.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.orgRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Organization | null> {
    return this.orgRepo.findOne({ where: { id } });
  }
}
