import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Enrollment, EnrollmentStatus, PaymentStatus } from '../../database/schemas/enrollment.schema';
import { Course } from '../../database/schemas/course.schema';
import { UpdatePurchaseStatusDto } from './dto/update-purchase-status.dto';

@Injectable()
export class AdminPurchasesService {
    constructor(
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,
    ) {}

    async findAll(filter?: { status?: string; method?: string; courseId?: string }) {
        const query: any = {};

        if (filter?.status) {
            query['paymentSummary.status'] = filter.status;
        }
        if (filter?.method) {
            query['paymentSummary.method'] = filter.method;
        }
        if (filter?.courseId) {
            query.courseId = new Types.ObjectId(filter.courseId);
        }

        const enrollments = await this.enrollmentModel
            .find(query)
            .populate('courseId', 'title thumbnailUrl')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        return enrollments.map((enrollment) => {
            const course = enrollment.courseId as any;
            const user = enrollment.userId as any;

            return {
                id: enrollment._id.toString(),
                courseId: course?._id?.toString() || '',
                courseTitle: course?.title || 'Unknown Course',
                courseThumbnail: course?.thumbnailUrl || '',
                studentId: user?._id?.toString() || '',
                studentName: user?.name || 'Unknown',
                studentEmail: user?.email || '',
                method: enrollment.paymentSummary.method,
                trxId: enrollment.paymentSummary.trxId || null,
                amount: enrollment.paymentSummary.amount,
                paymentStatus: enrollment.paymentSummary.status,
                enrollmentStatus: enrollment.status,
                paidAt: enrollment.paymentSummary.paidAt,
                createdAt: enrollment.createdAt,
                updatedAt: enrollment.updatedAt,
            };
        });
    }

    async findOne(id: string) {
        const enrollment = await this.enrollmentModel
            .findById(id)
            .populate('courseId', 'title thumbnailUrl price')
            .populate('userId', 'name email phone')
            .lean()
            .exec();

        if (!enrollment) {
            throw new NotFoundException('Purchase record not found');
        }

        const course = enrollment.courseId as any;
        const user = enrollment.userId as any;

        return {
            id: enrollment._id.toString(),
            courseId: course?._id?.toString() || '',
            courseTitle: course?.title || 'Unknown Course',
            courseThumbnail: course?.thumbnailUrl || '',
            coursePrice: course?.price || 0,
            studentId: user?._id?.toString() || '',
            studentName: user?.name || 'Unknown',
            studentEmail: user?.email || '',
            studentPhone: user?.phone || null,
            method: enrollment.paymentSummary.method,
            trxId: enrollment.paymentSummary.trxId || null,
            amount: enrollment.paymentSummary.amount,
            paymentStatus: enrollment.paymentSummary.status,
            enrollmentStatus: enrollment.status,
            paidAt: enrollment.paymentSummary.paidAt,
            createdAt: enrollment.createdAt,
            updatedAt: enrollment.updatedAt,
        };
    }

    async updateStatus(id: string, dto: UpdatePurchaseStatusDto) {
        const enrollment = await this.enrollmentModel.findById(id).exec();

        if (!enrollment) {
            throw new NotFoundException('Purchase record not found');
        }

        // Update payment status
        enrollment.paymentSummary.status = dto.status;

        // If payment verified, activate enrollment
        if (dto.status === PaymentStatus.VERIFIED) {
            enrollment.status = EnrollmentStatus.ACTIVE;
        }

        await enrollment.save();

        return {
            success: true,
            message: `Payment ${dto.status} successfully`,
            enrollment: {
                id: enrollment._id.toString(),
                status: enrollment.status,
                paymentStatus: enrollment.paymentSummary.status,
            },
        };
    }
}
