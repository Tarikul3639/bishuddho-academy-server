import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';

import type { Response } from 'express';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { JwtPayload } from '../../auth/interface/jwt-payload';

import { DownloadCertificateService } from '../services/download-certificate.service';

@ApiTags('Certificates')
@Controller('certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DownloadCertificateController {
  constructor(
    private readonly downloadCertificateService: DownloadCertificateService,
  ) {}

  @Get(':certificateId/download')
  @ApiOperation({
    summary: 'Download certificate',
  })
  @ApiResponse({
    status: 200,
    description: 'Certificate downloaded successfully',
  })
  async download(
    @Param('certificateId')
    certificateId: string,

    @CurrentUser()
    user: JwtPayload,

    @Res()
    res: Response,
  ): Promise<void> {
    await this.downloadCertificateService.execute(certificateId, user, res);
  }
}
