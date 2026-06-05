import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Course } from "../../../database/schemas/course.schema";
import { Enrollment } from "../../../database/schemas/enrollment.schema";

import { AdminFindCourseDetailsResponseDto } from "../dto/admin-find-course-details-response.dto";
import { EnrollmentWithUser } from "../interfaces/enrollment-with-user.interface";

@Injectable()
export class AdminFindCourseDetailsService {
    constructor(
        @InjectModel(Course.name)
        private courseModel: Model<Course>,

        @InjectModel(Enrollment.name)
        private enrollmentModel: Model<Enrollment>,
    ) { }

    async findById(
        courseId: string,
    ): Promise<AdminFindCourseDetailsResponseDto> {

        const courseObjectId = new Types.ObjectId(courseId);

        const course = await this.courseModel
            .findById(courseObjectId)
            .lean()
            .exec();

        if (!course) {
            throw new NotFoundException(
                "Course not found",
            );
        }

        const enrollments =
            await this.enrollmentModel
                .find({
                    courseId: course._id,
                })
                .populate(
                    "userId",
                    "name email",
                )
                .lean<EnrollmentWithUser[]>()
                .exec();

        const bookedSeats =
            enrollments.filter(
                (e) => e.status === "active",
            ).length;

        const revenue = enrollments.reduce(
            (sum, enrollment) => {
                return (
                    sum +
                    (enrollment.paymentSummary?.amount || 0)
                );
            },
            0,
        );

        const lessons =
            course.modules?.reduce(
                (total, module) =>
                    total +
                    (module.classes?.length || 0),
                0,
            ) || 0;

        return {
            courseId: course._id.toString(),

            title: course.title,
            tagline: course.tagline,
            description: course.description,

            thumbnailUrl: course.thumbnailUrl,

            instructor: course.instructor,
            schedule: course.schedule,
            location: course.location,

            startDate: course.startDate,
            duration: course.duration,

            totalSeats: course.totalSeats,
            bookedSeats,

            price: course.price,
            originalPrice: course.originalPrice,

            discountStarts: course.discountStarts,
            discountEnds: course.discountEnds,

            status: course.status,

            revenue,
            lessons,

            includes: course.includes,
            modules: course.modules.map((module) => ({
                title: module.title,
                classes: module.classes.map((cls) => ({
                    title: cls.title,
                    session: cls.session,
                    completed: cls.completed,
                })),
            })),

            students: enrollments.map(
                (enrollment) => ({
                    enrollId:
                        enrollment._id.toString(),

                    name:
                        enrollment.userId?.name ||
                        "Unknown",

                    email:
                        enrollment.userId?.email ||
                        "",

                    method:
                        enrollment.paymentSummary
                            ?.method,

                    trxId:
                        enrollment.paymentSummary
                            ?.trxId,

                    amount:
                        enrollment.paymentSummary
                            ?.amount,

                    date:
                        enrollment.paymentSummary
                            ?.paidAt,

                    status:
                        enrollment.status as
                        | "active"
                        | "pending"
                        | "completed",
                }),
            ),
        };
    }
}