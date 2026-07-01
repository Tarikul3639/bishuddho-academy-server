// reorder-teachers.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';
import { ReorderTeachersDto } from '../dto/reorder-teachers.dto';

@Injectable()
export class ReorderTeachersService {
    constructor(
        @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    ) {}

    async reorder(dto: ReorderTeachersDto) {
        const updates = dto.items.map(({ teacherId, displayOrder }) =>
            this.teacherModel
                .findByIdAndUpdate(teacherId, { $set: { displayOrder } })
                .lean()
                .exec(),
        );

        await Promise.all(updates);

        return { message: 'Teacher order updated successfully' };
    }
}
