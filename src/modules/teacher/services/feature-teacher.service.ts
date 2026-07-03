// feature-teacher.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';
import { FeatureTeacherDto } from '../dto/feature-teacher.dto';

@Injectable()
export class FeatureTeacherService {
    constructor(
        @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    ) {}

    async feature(teacherId: string, dto: FeatureTeacherDto) {
        const teacher = await this.teacherModel.findById(teacherId).lean().exec();

        if (!teacher) {
            throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
        }

        await this.teacherModel
            .findByIdAndUpdate(teacherId, { $set: { featured: dto.featured } })
            .exec();

        return {
            teacherId,
            featured: dto.featured,
            message: dto.featured
                ? 'Teacher featured successfully'
                : 'Teacher unfeatured successfully',
        };
    }
}
