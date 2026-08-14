import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Course } from '../../../database/schemas/course.schema';

import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service';

@Injectable()
export class AdminDeleteCourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(courseId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    // Delete thumbnail from Cloudinary
    if (course.thumbnailPublicId) {
      await this.cloudinaryService.deleteFile(course.thumbnailPublicId);
    }

    // Delete course from database
    await this.courseModel.findByIdAndDelete(courseId);

    return {
      success: true,
      message: 'Course deleted successfully.',
    };
  }
}
