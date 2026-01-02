import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FormField } from './form-field.entity';

@Injectable()
export class FormFieldsService {
  constructor(
    @InjectRepository(FormField)
    private readonly fieldsRepo: Repository<FormField>,
  ) {}

  async list(formId: string) {
    return this.fieldsRepo.find({
      where: { formId },
      order: { order: 'ASC' },
    });
  }

  async create(formId: string, data: Partial<FormField>) {
    const field = this.fieldsRepo.create({
      formId,
      type: data.type,
      label: data.label,
      required: data.required ?? false,
      order: data.order ?? 0,
    });
    return this.fieldsRepo.save(field);
  }

  async update(formId: string, id: string, data: Partial<FormField>) {
    const field = await this.fieldsRepo.findOne({ where: { id, formId } });
    if (!field) {
      throw new NotFoundException('Field not found');
    }

    await this.fieldsRepo.update(id, data);
    return this.fieldsRepo.findOne({ where: { id } });
  }

  async remove(formId: string, id: string) {
    const field = await this.fieldsRepo.findOne({ where: { id, formId } });
    if (!field) {
      throw new NotFoundException('Field not found');
    }
    await this.fieldsRepo.delete(id);
    return field;
  }

  async reorder(formId: string, items: { id: string; order: number }[]) {
    const fields = await this.fieldsRepo.find({ where: { formId } });
    const fieldIds = new Set(fields.map((field) => field.id));

    for (const item of items) {
      if (fieldIds.has(item.id)) {
        await this.fieldsRepo.update(item.id, { order: item.order });
      }
    }

    return this.list(formId);
  }
}
