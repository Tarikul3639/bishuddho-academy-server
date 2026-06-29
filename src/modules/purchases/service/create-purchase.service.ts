import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Enrollment, EnrollmentStatus, PaymentStatus } from '../../database/schemas/enrollment.schema';
import { Course } from '../../database/schemas/course.schema';
import { CreatePurchaseDto } from './dto/create-purchase.dto';

@Injectable()
export class CreatePurchaseService {
    constructor(
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,
    ) {}

    async createPurchase(userId: string, dto: CreatePurchaseDto) {
        // Validate course exists
        const course = await this.courseModel.findById(dto.courseId).lean().exec();
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Check for existing enrollment/purchase
        const existing = await this.enrollmentModel.findOne({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(dto.courseId),
        }).lean().exec();

        if (existing) {
            throw new ConflictException('You have already submitted a purchase request for this course');
        }

        // Validate trxId for non-cash methods
        if (dto.method !== 'cash' && !dto.trxId?.trim()) {
            throw new BadRequestException('Transaction ID is required for this payment method');
        }

        // Create enrollment with pending status
        const enrollment = await this.enrollmentModel.create({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(dto.courseId),
            currentSession: 0,
            status: EnrollmentStatus.PENDING,
            paymentSummary: {
                method: dto.method,
                trxId: dto.method === 'cash' ? undefined : dto.trxId?.trim(),
                amount: course.price,
                paidAt: new Date().toISOString(),
                status: PaymentStatus.PENDING,
            },
        });

        return {
            success: true,
            message: 'Purchase request submitted successfully',
            enrollment: {
                id: enrollment._id.toString(),
                courseId: dto.courseId,
                status: enrollment.status,
                payment: enrollment.paymentSummary,
            },
        };
    }
}
