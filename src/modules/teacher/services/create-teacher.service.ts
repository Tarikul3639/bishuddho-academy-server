// create-teacher.service.ts

import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';
import { CreateTeacherDto } from '../dto/create-teacher.dto';

@Injectable()
export class CreateTeacherService {
    constructor(
        @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    ) {}

    async create(
        dto: CreateTeacherDto,
        profileImageFile?: Express.Multer.File,
        coverImageFile?: Express.Multer.File,
    ) {
        const existing = await this.teacherModel
            .findOne({ slug: dto.slug })
            .lean()
            .exec();

        if (existing) {
            throw new ConflictException(`A teacher with slug "${dto.slug}" already exists`);
        }

        const profileImage = profileImageFile
            ? `/uploads/teachers/profiles/${profileImageFile.filename}`
            : '';

        const coverImage = coverImageFile
            ? `/uploads/teachers/covers/${coverImageFile.filename}`
            : '';

        const teacher = await this.teacherModel.create({
            ...dto,
            profileImage,
            coverImage,
        });

        return {
            teacherId: teacher._id.toString(),
            fullName: teacher.fullName,
            slug: teacher.slug,
            designation: teacher.designation,
            profileImage: teacher.profileImage,
        };
    }
}
