// service/admin-purchases.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
    Enrollment,
    EnrollmentStatus,
} from "../../../database/schemas/enrollment.schema";
import {
    Payment,
    PaymentStatus,
} from "../../../database/schemas/payment.schema";
import { Course } from "../../../database/schemas/course.schema";
import { UpdatePurchaseStatusDto } from "../dto/update-purchase-status.dto";

@Injectable()
export class AdminPurchasesService {
    constructor(
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,

        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,

        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,
    ) { }

    async findAll(filter?: {
        status?: string;
        method?: string;
        courseId?: string;
    }) {
        const paymentQuery: any = {};

        if (filter?.status) {
            paymentQuery.status = filter.status;
        }

        if (filter?.method) {
            paymentQuery.method = filter.method;
        }

        const payments = await this.paymentModel
            .find(paymentQuery)
            .populate({
                path: "enrollmentId",
                populate: [
                    {
                        path: "courseId",
                        select: "title thumbnailUrl",
                    },
                    {
                        path: "userId",
                        select: "name email",
                    },
                ],
            })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        const filteredPayments = filter?.courseId
            ? payments.filter(
                (payment: any) =>
                    payment.enrollmentId?.courseId?._id?.toString() === filter.courseId,
            )
            : payments;

        return filteredPayments.map((payment: any) => {
            const enrollment = payment.enrollmentId;
            const course = enrollment?.courseId;
            const user = enrollment?.userId;

            return {
                id: payment._id.toString(),
                enrollmentId: enrollment?._id?.toString() || "",
                courseId: course?._id?.toString() || "",
                courseTitle: course?.title || "Unknown Course",
                courseThumbnail: course?.thumbnailUrl || "",
                studentId: user?._id?.toString() || "",
                studentName: user?.name || "Unknown",
                studentEmail: user?.email || "",
                method: payment.method,
                trxId: payment.trxId || null,
                amount: payment.amount,
                paymentStatus: payment.status,
                enrollmentStatus: enrollment?.status,
                paidAt: payment.paidAt,
                verifiedAt: payment.verifiedAt,
                rejectionReason: payment.rejectionReason,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
            };
        });
    }

    async findOne(id: string) {
        const payment = await this.paymentModel
            .findById(id)
            .populate({
                path: "enrollmentId",
                populate: [
                    {
                        path: "courseId",
                        select: "title thumbnailUrl price",
                    },
                    {
                        path: "userId",
                        select: "name email phone",
                    },
                ],
            })
            .lean()
            .exec();

        if (!payment) {
            throw new NotFoundException("Purchase record not found");
        }

        const enrollment: any = payment.enrollmentId;
        const course = enrollment?.courseId;
        const user = enrollment?.userId;

        return {
            id: payment._id.toString(),
            enrollmentId: enrollment?._id?.toString() || "",
            courseId: course?._id?.toString() || "",
            courseTitle: course?.title || "Unknown Course",
            courseThumbnail: course?.thumbnailUrl || "",
            coursePrice: course?.price || 0,
            studentId: user?._id?.toString() || "",
            studentName: user?.name || "Unknown",
            studentEmail: user?.email || "",
            studentPhone: user?.phone || null,
            method: payment.method,
            trxId: payment.trxId || null,
            amount: payment.amount,
            paymentStatus: payment.status,
            enrollmentStatus: enrollment?.status,
            paidAt: payment.paidAt,
            verifiedBy: payment.verifiedBy?.toString(),
            verifiedAt: payment.verifiedAt,
            rejectionReason: payment.rejectionReason,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    }

    async updateStatus(id: string, dto: UpdatePurchaseStatusDto) {
        const payment = await this.paymentModel.findById(id).exec();

        if (!payment) {
            throw new NotFoundException("Purchase record not found");
        }

        const enrollment = await this.enrollmentModel.findById(
            payment.enrollmentId,
        );

        if (!enrollment) {
            throw new NotFoundException("Enrollment not found");
        }

        payment.status = dto.status;

        if (dto.status === PaymentStatus.VERIFIED) {
            payment.verifiedAt = new Date();
            payment.rejectionReason = undefined;
            enrollment.status = EnrollmentStatus.ACTIVE;
        }

        if (dto.status === PaymentStatus.REJECTED) {
            payment.rejectionReason = dto.rejectionReason;
            payment.verifiedAt = undefined;
            enrollment.status = EnrollmentStatus.PENDING;
        }

        await Promise.all([payment.save(), enrollment.save()]);

        return {
            success: true,
            message: `Payment ${dto.status} successfully`,
            payment: {
                id: payment._id.toString(),
                status: payment.status,
            },
            enrollment: {
                id: enrollment._id.toString(),
                status: enrollment.status,
            },
        };
    }
}