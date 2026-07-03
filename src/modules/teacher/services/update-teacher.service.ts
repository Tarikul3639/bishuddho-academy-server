import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Teacher } from "../../../database/schemas/teacher.schema";
import { UpdateTeacherDto } from "../dto/update-teacher.dto";
import { CloudinaryService } from "../../../common/cloudinary/cloudinary.service";

@Injectable()
export class UpdateTeacherService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<Teacher>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async update(
    teacherId: string,
    dto: UpdateTeacherDto,
    profileImageFile?: Express.Multer.File,
  ) {
    const teacher = await this.teacherModel.findById(teacherId);

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
    }

    Object.assign(teacher, dto);

    if (profileImageFile) {
      const uploaded = await this.cloudinaryService.replaceFile(
        profileImageFile,
        "teachers/profiles",
        teacher.profileImagePublicId,
      );

      teacher.profileImage = uploaded.secureUrl;
      teacher.profileImagePublicId = uploaded.publicId;
    }

    await teacher.save();

    return {
      teacherId: teacher._id.toString(),
      fullName: teacher.fullName,
      slug: teacher.slug,
      designation: teacher.designation,
      profileImage: teacher.profileImage,
      profileImagePublicId: teacher.profileImagePublicId,
      shortBio: teacher.shortBio,
      biography: teacher.biography,
      email: teacher.email,
      phone: teacher.phone,
      yearsOfExperience: teacher.yearsOfExperience,
      skills: teacher.skills,
      socialLinks: teacher.socialLinks,
      isActive: teacher.isActive,
      featured: teacher.featured,
      displayOrder: teacher.displayOrder,
      updatedAt: teacher.updatedAt,
    };
  }
}