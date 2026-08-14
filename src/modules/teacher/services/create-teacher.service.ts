import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Teacher } from '../../../database/schemas/teacher.schema';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { CloudinaryService } from '../../../common/cloudinary/cloudinary.service';

@Injectable()
export class CreateTeacherService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<Teacher>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateTeacherDto, profileImageFile?: Express.Multer.File) {
    const existing = await this.teacherModel
      .findOne({ slug: dto.slug })
      .lean()
      .exec();

    if (existing) {
      throw new ConflictException(
        `A teacher with slug "${dto.slug}" already exists`,
      );
    }

    let profileImage = '';
    let profileImagePublicId = '';

    if (profileImageFile) {
      const uploaded = await this.cloudinaryService.uploadFile(
        profileImageFile,
        'teachers/profiles',
      );

      profileImage = uploaded.secureUrl;
      profileImagePublicId = uploaded.publicId;
    }

    const teacher = await this.teacherModel.create({
      ...dto,
      profileImage,
      profileImagePublicId,
    });

    return {
      teacherId: teacher._id.toString(),
      fullName: teacher.fullName,
      slug: teacher.slug,
      designation: teacher.designation,
      shortBio: teacher.shortBio,
      biography: teacher.biography,
      profileImage: teacher.profileImage,
      profileImagePublicId: teacher.profileImagePublicId,
      email: teacher.email,
      phone: teacher.phone,
      yearsOfExperience: teacher.yearsOfExperience,
      skills: teacher.skills,
      socialLinks: teacher.socialLinks,
      isActive: teacher.isActive,
      featured: teacher.featured,
      displayOrder: teacher.displayOrder,
      createdAt: teacher.createdAt,
    };
  }
}
