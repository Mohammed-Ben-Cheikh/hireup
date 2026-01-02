import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../users/user.entity';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN_RH, UserRole.RH)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        candidateId: 'uuid',
        orgId: 'uuid',
        filename: 'cv.pdf',
        mimeType: 'application/pdf',
        size: 12345,
        objectKey: 'org/candidate/...',
      },
    },
  })
  upload(
    @Body() payload: UploadDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { orgId: string | null } },
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    return this.documentsService.upload(req.user.orgId, payload.candidateId, file);
  }

  @Get(':id/download')
  async download(
    @Param('id') id: string,
    @Req() req: { user: { orgId: string | null } },
    @Res() res: Response,
  ) {
    if (!req.user.orgId) {
      throw new BadRequestException('Organization is required');
    }

    const { document, stream } = await this.documentsService.download(
      req.user.orgId,
      id,
    );

    res.setHeader('Content-Type', document.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${document.filename}"`,
    );

    stream.pipe(res);
  }
}
