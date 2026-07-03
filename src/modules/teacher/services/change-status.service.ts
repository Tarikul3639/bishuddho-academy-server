// change-status.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';
import { ChangeStatusDto } from '../dto/change-status.dto';

@Injectable()
export class ChangeStatusService {
    constructor(
        @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    ) {}

    async changeStatus(teacherId: string, dto: ChangeStatusDto) {
        const teacher = await this.teacherModel.findById(teacherId).lean().exec();

        if (!teacher) {
            throw new NotFoundException(`Teacher with ID "${teacherId}" not found`);
        }

        await this.teacherModel
            .findByIdAndUpdate(teacherId, { $set: { isActive: dto.isActive } })
            .exec();

        return {
            teacherId,
            isActive: dto.isActive,
            message: dto.isActive
                ? 'Teacher activated successfully'
                : 'Teacher deactivated successfully',
        };
    }
}
