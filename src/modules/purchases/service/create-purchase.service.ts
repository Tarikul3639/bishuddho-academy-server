import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import {
    Enrollment,
    EnrollmentStatus,
} from "../../../database/schemas/enrollment.schema";

import { Course } from "../../../database/schemas/course.schema";

import {
    Payment,
    PaymentStatus,
} from "../../../database/schemas/payment.schema";

import { CreatePurchaseDto } from "../dto/create-purchase.dto";

@Injectable()
export class CreatePurchaseService {
    constructor(
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,

        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,

        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,
    ) {}

    async createPurchase(userId: string, dto: CreatePurchaseDto) {
        const course = await this.courseModel
            .findById(dto.courseId)
            .lean()
            .exec();

        if (!course) {
            throw new NotFoundException("Course not found");
        }

        const existingEnrollment = await this.enrollmentModel
            .findOne({
                userId: new Types.ObjectId(userId),
                courseId: new Types.ObjectId(dto.courseId),
            })
            .lean()
            .exec();

        if (existingEnrollment) {
            throw new ConflictException(
                "You have already submitted a purchase request for this course",
            );
        }

        if (dto.method !== "cash" && !dto.trxId?.trim()) {
            throw new BadRequestException(
                "Transaction ID is required for this payment method",
            );
        }

        const enrollment = await this.enrollmentModel.create({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(dto.courseId),
            status: EnrollmentStatus.PENDING,
        });

        const payment = await this.paymentModel.create({
            enrollmentId: enrollment._id,
            method: dto.method,
            trxId: dto.method === "cash" ? undefined : dto.trxId?.trim(),
            amount: course.price,
            paidAt: new Date(),
            status: PaymentStatus.PENDING,
        });

        return {
            success: true,
            message: "Purchase request submitted successfully",
            enrollment: {
                id: enrollment._id.toString(),
                courseId: dto.courseId,
                status: enrollment.status,
            },
            payment: {
                id: payment._id.toString(),
                method: payment.method,
                trxId: payment.trxId,
                amount: payment.amount,
                paidAt: payment.paidAt,
                status: payment.status,
            },
        };
    }
}