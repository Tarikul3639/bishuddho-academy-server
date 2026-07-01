// get-teachers.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../../../database/schemas/teacher.schema';
import { GetTeachersDto } from '../dto/get-teachers.dto';

@Injectable()
export class GetTeachersService {
    constructor(
        @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    ) {}

    async findAll(query: GetTeachersDto) {
        const {
            search,
            department,
            expertise,
            featured,
            isActive,
            isFounder,
            isLeadInstructor,
            showOnHomepage,
            page = 1,
            limit = 20,
        } = query;

        const filter: Record<string, unknown> = {};

        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { shortBio: { $regex: search, $options: 'i' } },
                { expertise: { $elemMatch: { $regex: search, $options: 'i' } } },
            ];
        }

        if (department) filter.department = { $regex: department, $options: 'i' };
        if (expertise) filter.expertise = { $elemMatch: { $regex: expertise, $options: 'i' } };
        if (featured !== undefined) filter.featured = featured;
        if (isActive !== undefined) filter.isActive = isActive;
        if (isFounder !== undefined) filter.isFounder = isFounder;
        if (isLeadInstructor !== undefined) filter.isLeadInstructor = isLeadInstructor;
        if (showOnHomepage !== undefined) filter.showOnHomepage = showOnHomepage;

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
            teachers: teachers.map((t) => ({
                teacherId: t._id.toString(),
                fullName: t.fullName,
                slug: t.slug,
                designation: t.designation,
                department: t.department,
                shortBio: t.shortBio,
                profileImage: t.profileImage,
                expertise: t.expertise,
                featured: t.featured,
                isActive: t.isActive,
                isFounder: t.isFounder,
                isLeadInstructor: t.isLeadInstructor,
                displayOrder: t.displayOrder,
                showOnHomepage: t.showOnHomepage,
                yearsOfExperience: t.yearsOfExperience,
                socialLinks: t.socialLinks,
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
