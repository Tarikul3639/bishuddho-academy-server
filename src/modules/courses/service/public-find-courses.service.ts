// service/find-public-courses.service.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Course, CourseStatus } from "../../../database/schemas/course.schema";
import { PublicCourseResponseDto } from "../dto/public-course-response.dto";

@Injectable()
export class PublicFindCoursesService {
    constructor(
        @InjectModel(Course.name)
        private courseModel: Model<Course>,
    ) { }

    async findAll({
        page = 1,
        limit = 10,
    }: {
        page?: number;
        limit?: number;
    }): Promise<{
        courses: PublicCourseResponseDto[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }> {
        const skip = (page - 1) * limit;

        const filter = {
            status: {
                $in: [CourseStatus.ACTIVE, CourseStatus.UPCOMING],
            },
        };

        const [courses, total] = await Promise.all([
            this.courseModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec(),

            this.courseModel.countDocuments(filter),
        ]);

        return {
            courses: courses.map((course) => ({
                courseId: course._id.toString(),

                title: course.title,
                tagline: course.tagline,

                thumbnailUrl: course.thumbnailUrl,

                instructor: course.instructor,

                price: course.price,
                originalPrice: course.originalPrice,

                averageRating: course.averageRating,
                reviewCount: course.reviewCount,

                status: course.status,
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