// service/find-public-courses.service.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Course, CourseStatus } from "../../../database/schemas/course.schema";
import { Enrollment } from "../../../database/schemas/enrollment.schema";
import { PublicCourseResponseDto } from "../dto/public-course-response.dto";

@Injectable()
export class PublicFindCoursesService {
    constructor(
        @InjectModel(Course.name)
        private courseModel: Model<Course>,
        @InjectModel(Enrollment.name)
        private enrollmentModel: Model<Enrollment>,
    ) { }

    async findAll({
        page = 1,
        limit = 10,
        userId,
    }: {
        page?: number;
        limit?: number;
        userId?: string;
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

        // Get enrolled course IDs for the user
        let enrolledCourseIds: Set<string> = new Set();
        if (userId) {
            const enrollments = await this.enrollmentModel
                .find({ userId: new Types.ObjectId(userId) })
                .select("courseId")
                .lean()
                .exec();
            enrolledCourseIds = new Set(
                enrollments.map((e) => e.courseId.toString())
            );
        }

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

                isEnrolled: enrolledCourseIds.has(course._id.toString()),
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
}