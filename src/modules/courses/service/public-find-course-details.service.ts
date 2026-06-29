import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";

import {
    Model,
    Types,
} from "mongoose";

import {
    Course,
} from "../../../database/schemas/course.schema";

import {
    Enrollment,
    EnrollmentStatus,
} from "../../../database/schemas/enrollment.schema";

import {
    Payment,
} from "../../../database/schemas/payment.schema";

import {
    PublicCourseDetailsResponseDto,
    CourseModuleDto,
    PublicCoursePaymentDto,
} from "../dto/public-course-details-response.dto";

@Injectable()
export class PublicFindCourseDetailsService {
    constructor(
        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,

        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,

        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,
    ) {}

    async findById(
        courseId: string,
        userId?: string,
    ): Promise<PublicCourseDetailsResponseDto> {

        const course = await this.courseModel
            .findById(courseId)
            .lean()
            .exec();

        if (!course) {
            throw new NotFoundException(
                "Course not found",
            );
        }

        /* -----------------------------
           BOOKED SEATS
        ------------------------------ */

        const bookedSeats =
            await this.enrollmentModel.countDocuments({
                courseId: course._id,
                status: EnrollmentStatus.ACTIVE,
            });

        /* -----------------------------
           LESSON COUNT
        ------------------------------ */

        const lessons =
            course.modules?.reduce(
                (total, module) =>
                    total +
                    (module.classes?.length ?? 0),
                0,
            ) ?? 0;

        /* -----------------------------
           DISCOUNT
        ------------------------------ */

        const discount =
            course.originalPrice > 0
                ? Math.round(
                      ((course.originalPrice -
                          course.price) /
                          course.originalPrice) *
                          100,
                  )
                : 0;

        /* -----------------------------
           DAYS LEFT
        ------------------------------ */

        const daysLeft = Math.max(
            0,
            Math.ceil(
                (new Date(
                    course.startDate,
                ).getTime() -
                    Date.now()) /
                    (1000 * 60 * 60 * 24),
            ),
        );

        /* -----------------------------
           USER ENROLLMENT
        ------------------------------ */

        let isEnrolled = false;

        let enrollmentStatus:
            | EnrollmentStatus
            | undefined;

        let payment:
            | PublicCoursePaymentDto
            | undefined;

        if (userId) {
            const enrollment =
                await this.enrollmentModel
                    .findOne({
                        courseId: course._id,
                        userId: new Types.ObjectId(
                            userId,
                        ),
                    })
                    .lean()
                    .exec();

            if (enrollment) {
                isEnrolled = true;

                enrollmentStatus =
                    enrollment.status;

                const paymentDoc =
                    await this.paymentModel
                        .findOne({
                            enrollmentId:
                                enrollment._id,
                        })
                        .lean()
                        .exec();

                if (paymentDoc) {
                    payment = {
                        method:
                            paymentDoc.method,

                        trxId:
                            paymentDoc.trxId,

                        amount:
                            paymentDoc.amount,

                        paidAt:
                            new Date(
                                paymentDoc.paidAt,
                            ).toISOString(),

                        status:
                            paymentDoc.status,

                        verifiedBy:
                            paymentDoc.verifiedBy?.toString(),

                        verifiedAt:
                            paymentDoc.verifiedAt
                                ? new Date(
                                      paymentDoc.verifiedAt,
                                  ).toISOString()
                                : undefined,

                        rejectionReason:
                            paymentDoc.rejectionReason,
                    };
                }
            }
        }

        /* -----------------------------
           MODULES
        ------------------------------ */

        const modules: CourseModuleDto[] =
            course.modules?.map(
                (module) => ({
                    title: module.title,

                    classes:
                        module.classes?.map(
                            (cls) => ({
                                title:
                                    cls.title,

                                session:
                                    cls.session,
                            }),
                        ) ?? [],
                }),
            ) ?? [];        /* -----------------------------
           RESPONSE
        ------------------------------ */

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

            startDate: new Date(
                course.startDate,
            ).toISOString(),

            isEnrolled,

            enrollmentStatus,

            payment,

            includes:
                course.includes ?? [],

            modules,
        };
    }
}