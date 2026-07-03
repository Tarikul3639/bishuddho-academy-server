import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Course } from "../../../database/schemas/course.schema";
import { AdminUpdateCourseDto } from "../dto/admin-update-course.dto";
import { CloudinaryService } from "../../../common/cloudinary/cloudinary.service";

@Injectable()
export class AdminUpdateCourseService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async update(
    courseId: string,
    thumbnailFile: Express.Multer.File,
    data: AdminUpdateCourseDto,
  ): Promise<Course> {
    const course = await this.courseModel.findById(courseId);

    if (!course) {
      throw new NotFoundException("Course not found.");
    }

    if (thumbnailFile) {
      const uploaded = await this.cloudinaryService.replaceFile(
        thumbnailFile,
        "courses/thumbnails",
        course.thumbnailPublicId,
      );

      data.thumbnailUrl = uploaded.secureUrl;
      data.thumbnailPublicId = uploaded.publicId;
    }

    Object.assign(course, data);

    await course.save();

    return course;
  }
}