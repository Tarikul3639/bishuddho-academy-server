// service/student-find-course-details.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import {
    Enrollment,
    EnrollmentStatus,
} from "../../../database/schemas/enrollment.schema";
import { Payment, PaymentStatus } from "../../../database/schemas/payment.schema";
import { Course } from "../../../database/schemas/course.schema";
import { StudentCourseDetailsResponseDto } from "../dto/student-course-details-response.dto";

@Injectable()
export class StudentFindCourseDetailsService {
    constructor(
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,

        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,

        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,
    ) { }

    async findById(
        userId: string,
        courseId: string,
    ): Promise<StudentCourseDetailsResponseDto> {
        const enrollment = await this.enrollmentModel
            .findOne({
                userId: new Types.ObjectId(userId),
                courseId: new Types.ObjectId(courseId),
                status: {
                    $in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
                },
            })
            .lean()
            .exec();

        if (!enrollment) {
            throw new NotFoundException("You are not enrolled in this course");
        }

        const payment = await this.paymentModel
            .findOne({
                enrollmentId: enrollment._id,
                status: {
                    $in: [PaymentStatus.VERIFIED],
                },
            })
            .lean()
            .exec();

        if (!payment) {
            throw new NotFoundException("Payment information not found");
        }

        const course = await this.courseModel
            .findById(courseId)
            .lean()
            .exec();

        if (!course) {
            throw new NotFoundException("Course not found");
        }

        const bookedSeats = await this.enrollmentModel.countDocuments({
            courseId: course._id,
            status: {
                $in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
            },
        });

        const lessons =
            course.modules?.reduce(
                (total, module) => total + (module.classes?.length || 0),
                0,
            ) || 0;

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

            duration: course.duration,
            lessons,

            totalSeats: course.totalSeats,
            bookedSeats,

            schedule: course.schedule,
            location: course.location,
            startDate: course.startDate,

            includes: course.includes || [],
            status: enrollment.status,

            payment: {
                method: payment.method,
                trxId: payment.trxId,
                amount: payment.amount,
                paidAt: payment.paidAt,
                status: payment.status,
                verifiedBy: payment.verifiedBy?.toString(),
                verifiedAt: payment.verifiedAt,
                rejectionReason: payment.rejectionReason,
            },

            modules:
                course.modules?.map((module) => ({
                    title: module.title,
                    classes:
                        module.classes?.map((cls) => ({
                            title: cls.title,
                            session: cls.session,
                            completed: cls.completed || false,
                        })) || [],
                })) || [],
        };
    }
}