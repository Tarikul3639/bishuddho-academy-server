import { Inject, Injectable } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType: 'image' | 'raw' = 'image',
  ): Promise<CloudinaryUploadResult> {
    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      stream.end(file.buffer);
    });
  }

  async deleteFile(
    publicId: string,
    resourceType: 'image' | 'raw' = 'image',
  ): Promise<void> {
    if (!publicId) {
      return;
    }

    await this.cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }

  async replaceFile(
    file: Express.Multer.File,
    folder: string,
    oldPublicId?: string,
    resourceType: 'image' | 'raw' = 'image',
  ): Promise<CloudinaryUploadResult> {
    const uploaded = await this.uploadFile(file, folder, resourceType);

    if (oldPublicId) {
      try {
        await this.deleteFile(oldPublicId, resourceType);
      } catch {}
    }

    return uploaded;
  }
}
