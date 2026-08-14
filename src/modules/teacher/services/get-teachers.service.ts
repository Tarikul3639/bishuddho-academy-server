// get-teachers.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';
import { GetTeachersDto } from '../dto/get-teachers.dto';

@Injectable()
export class GetTeachersService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<Teacher>,
  ) {}

  async findAll(query: GetTeachersDto) {
    const { search, featured, isActive, page = 1, limit = 20 } = query;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } },
        { shortBio: { $regex: search, $options: 'i' } },
        { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const skip = (page - 1) * limit;

    const [teachers, total] = await Promise.all([
      this.teacherModel
        .find(filter)
        .sort({ displayOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean()
        .exec(),

      this.teacherModel.countDocuments(filter),
    ]);

    return {
      teachers: teachers.map((teacher) => ({
        teacherId: teacher._id.toString(),
        fullName: teacher.fullName,
        slug: teacher.slug,
        designation: teacher.designation,
        shortBio: teacher.shortBio,
        profileImage: teacher.profileImage,
        yearsOfExperience: teacher.yearsOfExperience,
        skills: teacher.skills,
        socialLinks: teacher.socialLinks,
        featured: teacher.featured,
        isActive: teacher.isActive,
        displayOrder: teacher.displayOrder,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
