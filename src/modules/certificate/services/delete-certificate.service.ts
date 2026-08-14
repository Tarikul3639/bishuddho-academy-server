import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service';

import { Certificate } from '../../../database/schemas/certificate.schema';

@Injectable()
export class DeleteCertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    certificateId: string,
    adminId: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const certificate = await this.certificateModel.findById(certificateId);

    if (!certificate) {
      throw new NotFoundException('Certificate not found.');
    }

    if (certificate.cloudinaryPublicId) {
      await this.cloudinaryService.deleteFile(
        certificate.cloudinaryPublicId,
        'raw',
      );
    }

    await this.certificateModel.deleteOne({
      _id: certificate._id,
    });

    return {
      success: true,
      message: 'Certificate deleted successfully.',
    };
  }
}
