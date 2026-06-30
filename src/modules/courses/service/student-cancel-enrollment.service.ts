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
    Enrollment,
} from "../../../database/schemas/enrollment.schema";

import {
    Payment,
    PaymentStatus,
} from "../../../database/schemas/payment.schema";

@Injectable()
export class StudentCancelEnrollmentService {
    constructor(
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,

        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,
    ) { }

    async cancelEnrollment(
        userId: string,
        courseId: string,
    ) {
        const enrollment =
            await this.enrollmentModel.findOne({
                userId: new Types.ObjectId(userId),
                courseId: new Types.ObjectId(courseId),
            });

        if (!enrollment) {
            throw new NotFoundException(
                "Enrollment not found",
            );
        }

        const payment =
            await this.paymentModel.findOne({
                enrollmentId: enrollment._id,
            });

        if (!payment) {
            throw new NotFoundException(
                "Payment not found",
            );
        }

        if (
            payment.status !==
            PaymentStatus.REJECTED
        ) {
            throw new NotFoundException(
                "Only rejected enrollments can be cancelled.",
            );
        }

        await Promise.all([
            this.paymentModel.deleteOne({
                _id: payment._id,
            }),

            this.enrollmentModel.deleteOne({
                _id: enrollment._id,
            }),
        ]);

        return {
            success: true,
            message:
                "Enrollment cancelled successfully.",
        };
    }
}