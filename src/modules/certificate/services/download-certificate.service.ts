import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import axios from 'axios';
import type { Response } from 'express';

import { Certificate } from '../../../database/schemas/certificate.schema';
import { UserRole } from '../../../database/schemas/user.schema';

import type { JwtPayload } from '../../auth/interface/jwt-payload';

@Injectable()
export class DownloadCertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
  ) {}

  async execute(
    certificateId: string,
    user: JwtPayload,
    res: Response,
  ): Promise<void> {
    const certificate = await this.certificateModel.findById(certificateId);

    if (!certificate) {
      throw new NotFoundException('Certificate not found.');
    }

    if (
      user.role !== UserRole.ADMIN &&
      certificate.studentId.toString() !== user.userId
    ) {
      throw new ForbiddenException(
        'You are not allowed to download this certificate.',
      );
    }

    try {
      const file = await axios.get(certificate.pdfUrl, {
        responseType: 'stream',
      });

      res.setHeader('Content-Type', 'application/pdf');

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${certificate.certificateNo}.pdf"`,
      );

      res.setHeader('Cache-Control', 'no-store');

      file.data.pipe(res);
    } catch {
      throw new NotFoundException('Unable to retrieve certificate file.');
    }
  }
}
