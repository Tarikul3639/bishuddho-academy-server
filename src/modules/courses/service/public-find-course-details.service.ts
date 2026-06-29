// service/public-find-course-details.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Course } from "../../../database/schemas/course.schema";
import { Enrollment } from "../../../database/schemas/enrollment.schema";
import { PublicCourseDetailsResponseDto } from "../dto/public-course-details-response.dto";

@Injectable()
export class PublicFindCourseDetailsService {
    constructor(
        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,

        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
    ) { }

    async findById(courseId: string, userId?: string): Promise<PublicCourseDetailsResponseDto> {
        const course = await this.courseModel.findById(courseId).lean().exec();

        if (!course) {
            throw new NotFoundException("Course not found");
        }

        /* Students / Booked Seats */
        const bookedSeats = await this.enrollmentModel.countDocuments({
            courseId: course._id,
        });

        /* Total Lessons */
        const lessons =
            course.modules?.reduce(
                (total, module) => total + (module.classes?.length || 0),
                0,
            ) || 0;

        /* Discount */
        const discount =
            course.originalPrice > 0
                ? Math.round(
                    ((course.originalPrice - course.price) / course.originalPrice) * 100,
                )
                : 0;

        /* Days Left */
        const daysLeft = Math.max(
            0,
            Math.ceil(
                (new Date(course.startDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24),
            ),
        );

        let isEnrolled = false;

        if (userId) {
            const enrollment =
                await this.enrollmentModel.exists({
                    courseId: course._id,
                    userId: new Types.ObjectId(userId),
                });

            isEnrolled = !!enrollment;
        }

        return {
            courseId: course._id.toString(),
            title: course.title,
            tagline: course.tagline,
            description: course.description,
            thumbnailUrl: course.thumbnailUrl,
            instructor: course.instructor,
            averageRating: course.averageRating,
            reviewCount: course.reviewCount,
            students: bookedSeats,
            price: course.price,
            originalPrice: course.originalPrice,
            discount,
            daysLeft,
            duration: course.duration,
            lessons,
            totalSeats: course.totalSeats,
            bookedSeats,
            schedule: course.schedule,
            location: course.location,
            startDate: course.startDate,
            isEnrolled: isEnrolled,
            includes: course.includes || [],
            modules: course.modules?.map((module) => ({
                title: module.title,
                classes: module.classes?.map((cls) => ({
                    title: cls.title,
                    session: cls.session,
                })) || [],
            })) || [],
        };
    }
}