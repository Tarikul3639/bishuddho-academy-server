// delete-teacher.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';

@Injectable()
export class DeleteTeacherService {
    constructor(
        @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    ) {}

    async delete(teacherId: string) {
        const teacher = await this.teacherModel.findById(teacherId).lean().exec();

        if (!teacher) {
            throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
        }

        await this.teacherModel.findByIdAndDelete(teacherId).exec();

        return { message: 'Teacher deleted successfully', teacherId };
    }
}
