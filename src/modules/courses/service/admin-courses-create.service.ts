import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Course } from '../../../database/schemas/course.schema';
import { AdminCreateCourseDto } from '../dto/admin-create-course.dto';
import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service';

@Injectable()
export class AdminCreateCourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    dto: AdminCreateCourseDto,
    thumbnailFile?: Express.Multer.File,
  ): Promise<Course> {
    let thumbnailUrl = '';
    let thumbnailPublicId = '';

    if (thumbnailFile) {
      const uploaded = await this.cloudinaryService.uploadFile(
        thumbnailFile,
        'courses/thumbnails',
      );

      thumbnailUrl = uploaded.secureUrl;
      thumbnailPublicId = uploaded.publicId;
    }

    const course = await this.courseModel.create({
      ...dto,
      thumbnailUrl,
      thumbnailPublicId,
    });

    if (!course) {
      throw new NotFoundException('Failed to create course.');
    }

    return course;
  }
}
