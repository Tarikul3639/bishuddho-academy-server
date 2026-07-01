// update-teacher.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';

@Injectable()
export class UpdateTeacherService {
    constructor(
        @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    ) {}

    async update(
        teacherId: string,
        dto: UpdateTeacherDto,
        profileImageFile?: Express.Multer.File,
        coverImageFile?: Express.Multer.File,
    ) {
        const teacher = await this.teacherModel.findById(teacherId).exec();

        if (!teacher) {
            throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
        }

        const updates: Partial<Teacher> & Record<string, unknown> = { ...dto };

        if (profileImageFile) {
            updates.profileImage = `/uploads/teachers/profiles/${profileImageFile.filename}`;
        }

        if (coverImageFile) {
            updates.coverImage = `/uploads/teachers/covers/${coverImageFile.filename}`;
        }

        const updated = await this.teacherModel
            .findByIdAndUpdate(teacherId, { $set: updates }, { new: true })
            .lean()
            .exec();

        return {
            teacherId: updated!._id.toString(),
            fullName: updated!.fullName,
            slug: updated!.slug,
            designation: updated!.designation,
            profileImage: updated!.profileImage,
            coverImage: updated!.coverImage,
        };
    }
}
