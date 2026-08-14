// get-teacher-details.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';

@Injectable()
export class GetTeacherDetailsService {
  constructor(
    @InjectModel(Teacher.name)
    private readonly teacherModel: Model<Teacher>,
  ) {}

  async findBySlug(slug: string) {
    const teacher = await this.teacherModel
      .findOne({ slug, isActive: true })
      .select('-__v')
      .lean()
      .exec();

    if (!teacher) {
      throw new NotFoundException(`Teacher with slug "${slug}" not found`);
    }

    return {
      teacherId: teacher._id.toString(),
      fullName: teacher.fullName,
      slug: teacher.slug,
      designation: teacher.designation,
      shortBio: teacher.shortBio,
      biography: teacher.biography,
      profileImage: teacher.profileImage,
      email: teacher.email,
      phone: teacher.phone,
      yearsOfExperience: teacher.yearsOfExperience,
      skills: teacher.skills,
      socialLinks: teacher.socialLinks,
      featured: teacher.featured,
    };
  }

  async findByIdAdmin(teacherId: string) {
    const teacher = await this.teacherModel
      .findById(teacherId)
      .select('-__v')
      .lean()
      .exec();

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
    }

    return {
      teacherId: teacher._id.toString(),
      fullName: teacher.fullName,
      slug: teacher.slug,
      designation: teacher.designation,
      shortBio: teacher.shortBio,
      biography: teacher.biography,
      profileImage: teacher.profileImage,
      email: teacher.email,
      phone: teacher.phone,
      yearsOfExperience: teacher.yearsOfExperience,
      skills: teacher.skills,
      socialLinks: teacher.socialLinks,
      featured: teacher.featured,
      isActive: teacher.isActive,
      displayOrder: teacher.displayOrder,
      createdAt: teacher.createdAt,
      updatedAt: teacher.updatedAt,
    };
  }
}
