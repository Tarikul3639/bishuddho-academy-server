import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
    Course,
    CourseStatus,
} from "../../../database/schemas/course.schema";

import {
    Enrollment,
    EnrollmentStatus,
} from "../../../database/schemas/enrollment.schema";

import {
    Payment,
    PaymentStatus,
} from "../../../database/schemas/payment.schema";

import {
    DashboardStatsDto,
} from "../dto/dashboard-stats.dto";

@Injectable()
export class GetDashboardStatsService {
    constructor(
        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,

        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,

        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,
    ) { }

    async execute(): Promise<DashboardStatsDto> {
        const now = new Date();

        const monthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
        );

        /* ---------------------------------------
           Students
        --------------------------------------- */

        const totalStudents = await this.enrollmentModel.countDocuments({
            status: {
                $in: [
                    EnrollmentStatus.ACTIVE,
                ],
            },
        });

        const newStudentsThisMonth = await this.enrollmentModel.countDocuments({
            createdAt: {
                $gte: monthStart,
            },
        });

        /* ---------------------------------------
           Courses
        --------------------------------------- */

        const activeCourses = await this.courseModel.countDocuments({
            status: CourseStatus.ACTIVE,
        });

        const upcomingCourses = await this.courseModel.countDocuments({
            status: CourseStatus.UPCOMING,
        });

        /* ---------------------------------------
           Payments
        --------------------------------------- */

        const pendingPayments = await this.paymentModel.countDocuments({
            status: PaymentStatus.PENDING,
        });

        const verifiedPayments = await this.paymentModel
            .find({
                status: PaymentStatus.VERIFIED,
            })
            .lean();

        /* ---------------------------------------
           Revenue
        --------------------------------------- */

        let totalRevenue = 0;
        let revenueThisMonth = 0;

        for (const payment of verifiedPayments) {
            totalRevenue += payment.amount;

            if (
                payment.createdAt &&
                new Date(payment.createdAt) >= monthStart
            ) {
                revenueThisMonth += payment.amount;
            }
        }

        return {
            totalStudents,
            totalRevenue,
            activeCourses,
            upcomingCourses,
            pendingPayments,
            newStudentsThisMonth,
            revenueThisMonth,
        };
    }
}