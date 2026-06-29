// service/admin-find-course-details.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Course } from "../../../database/schemas/course.schema";
import {
    Enrollment,
    EnrollmentStatus,
} from "../../../database/schemas/enrollment.schema";
import {
    Payment,
    PaymentMethod,
    PaymentStatus,
} from "../../../database/schemas/payment.schema";
import {
    AdminFindCourseDetailsResponseDto,
    CourseModuleDto,
    StudentDto,
} from "../dto/admin-find-course-details-response.dto";
import { EnrollmentWithUser } from "../interfaces/enrollment-with-user.interface";

@Injectable()
export class AdminFindCourseDetailsService {
    constructor(
        @InjectModel(Course.name) private courseModel: Model<Course>,
        @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
        @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    ) { }

    async findById(courseId: string): Promise<AdminFindCourseDetailsResponseDto> {
        const course = await this.courseModel
            .findById(new Types.ObjectId(courseId))
            .lean()
            .exec();

        if (!course) {
            throw new NotFoundException("Course not found");
        }

        const enrollments = await this.enrollmentModel
            .find({ courseId: course._id })
            .populate("userId", "name email")
            .lean<EnrollmentWithUser[]>()
            .exec();

        const enrollmentIds = enrollments.map((e) => e._id);

        const payments = await this.paymentModel
            .find({ enrollmentId: { $in: enrollmentIds } })
            .lean()
            .exec();

        const paymentMap = new Map(
            payments.map((p) => [p.enrollmentId.toString(), p]),
        );

        const bookedSeats = enrollments.filter(
            (e) => e.status === EnrollmentStatus.ACTIVE,
        ).length;

        const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        const totalLessons =
            course.modules?.reduce(
                (total, mod) => total + (mod.classes?.length ?? 0),
                0,
            ) ?? 0;

        const modulesData: CourseModuleDto[] = course.modules.map((module) => ({
            title: module.title,
            classes: module.classes.map((cls) => ({
                title: cls.title,
                session: cls.session,
                completed: cls.completed,
            })),
        }));

        const studentsData: StudentDto[] = enrollments.map((enrollment) => {
            const payment = paymentMap.get(enrollment._id.toString());
            const method: PaymentMethod = payment?.method ?? PaymentMethod.CASH;
            const paymentStatus: PaymentStatus =
                payment?.status ?? PaymentStatus.PENDING;

            return {
                user: {
                    id: enrollment.userId?._id.toString(),
                    name: enrollment.userId?.name ?? "Unknown",
                    email: enrollment.userId?.email ?? "",
                },
                enrollment: {
                    enrollmentId: enrollment._id.toString(),
                    currentSession: enrollment.currentSession,
                    status: enrollment.status,
                },
                payment: payment
                    ? {
                        paymentId: payment._id.toString(),
                        method,
                        trxId: payment.trxId,
                        amount: payment.amount,
                        paidAt: new Date(payment.paidAt).toISOString(),
                        status: paymentStatus,
                        verifiedBy: payment.verifiedBy?.toString(),
                        verifiedAt: payment.verifiedAt
                            ? new Date(payment.verifiedAt).toISOString()
                            : undefined,
                        rejectionReason: payment.rejectionReason,
                    }
                    : undefined,
            };
        });

        return {
            courseId: course._id.toString(),
            title: course.title,
            tagline: course.tagline,
            description: course.description,
            thumbnailUrl: course.thumbnailUrl,
            instructor: course.instructor,
            schedule: course.schedule,
            location: course.location,
            startDate: new Date(course.startDate).toISOString(),
            duration: course.duration,
            totalSeats: course.totalSeats,
            bookedSeats,
            price: course.price,
            originalPrice: course.originalPrice,
            discountStarts: course.discountStarts
                ? new Date(course.discountStarts).toISOString()
                : null,
            discountEnds: course.discountEnds
                ? new Date(course.discountEnds).toISOString()
                : null,
            status: course.status,
            revenue,
            lessons: totalLessons,
            includes: course.includes,
            modules: modulesData,
            students: studentsData,
        };
    }
}