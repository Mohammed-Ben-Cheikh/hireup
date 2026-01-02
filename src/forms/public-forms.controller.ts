import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { FormsService } from './forms.service';

@ApiTags('public-forms')
@Controller('public/forms')
export class PublicFormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get(':publicId')
  @ApiOkResponse({
    schema: {
      example: {
        publicId: 'uuid',
        title: 'Formulaire de recrutement',
        description: 'Candidature développeur backend.',
        fields: [
          {
            id: 'uuid',
            type: 'text',
            label: 'Nom complet',
            required: true,
            order: 1,
          },
        ],
      },
    },
  })
  async getPublishedForm(@Param('publicId') publicId: string) {
    const form = await this.formsService.findPublishedByPublicId(publicId);
    return {
      publicId: form.publicId,
      title: form.title,
      description: form.description,
      fields: form.fields
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((field) => ({
          id: field.id,
          type: field.type,
          label: field.label,
          required: field.required,
          order: field.order,
        })),
    };
  }
}
