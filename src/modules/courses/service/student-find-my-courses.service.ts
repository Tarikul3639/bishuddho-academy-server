import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Enrollment } from "../../../database/schemas/enrollment.schema";
import { Payment } from "../../../database/schemas/payment.schema";
import { Course } from "../../../database/schemas/course.schema";
import { StudentMyCourseResponseDto } from "../dto/student-my-course-response.dto";

@Injectable()
export class StudentFindMyCoursesService {
    constructor(
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,

        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,

        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,
    ) { }

    async findMyCourses(userId: string): Promise<StudentMyCourseResponseDto[]> {
        const enrollments = await this.enrollmentModel
            .find({
                userId: new Types.ObjectId(userId),
            })
            .populate("courseId")
            .lean()
            .exec();

        const enrollmentIds = enrollments.map((enrollment) => enrollment._id);

        const payments = await this.paymentModel
            .find({
                enrollmentId: { $in: enrollmentIds },
            })
            .lean()
            .exec();

        const paymentMap = new Map(
            payments.map((payment) => [payment.enrollmentId.toString(), payment]),
        );

        return enrollments.map((enrollment) => {
            const course = enrollment.courseId as unknown as Course & {
                _id: Types.ObjectId;
            };

            const payment = paymentMap.get(enrollment._id.toString());

            if (!payment) {
                throw new Error(
                    `Payment not found for enrollment ${enrollment._id}`,
                );
            }

            /* -----------------------------
               Total Sessions
            ------------------------------ */
            const totalSessions =
                course.modules?.reduce(
                    (total, module) => total + (module.classes?.length ?? 0),
                    0,
                ) ?? 0;

            /* -----------------------------
               Current Session
            ------------------------------ */
            const currentSession =
                course.modules?.reduce(
                    (completed, module) =>
                        completed + (module.classes?.filter((cls) => cls.completed).length ?? 0),
                    0,
                ) ?? 0;

            return {
                courseId: course._id.toString(),
                title: course.title,
                thumbnailUrl: course.thumbnailUrl,
                instructor: course.instructor,
                status: enrollment.status,
                paymentStatus: payment.status,
                rejectionReason: payment?.rejectionReason,
                schedule: course.schedule,
                location: course.location,
                duration: course.duration,
                currentSession,
                totalSessions,
            };
        });
    }
}