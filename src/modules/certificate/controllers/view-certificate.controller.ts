import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';

import type { Response } from 'express';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import type { JwtPayload } from '../../auth/interface/jwt-payload';

import { ViewCertificateService } from '../services/view-certificate.service';

@ApiTags('Certificates')
@Controller('certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ViewCertificateController {
  constructor(
    private readonly viewCertificateService: ViewCertificateService,
  ) {}

  @Get(':certificateId/view')
  @ApiOperation({
    summary: 'View certificate',
  })
  async view(
    @Param('certificateId')
    certificateId: string,

    @CurrentUser()
    user: JwtPayload,

    @Res()
    res: Response,
  ): Promise<void> {
    await this.viewCertificateService.execute(certificateId, user, res);
  }
}
