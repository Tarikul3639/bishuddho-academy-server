import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Payment,
  PaymentStatus,
} from '../../../database/schemas/payment.schema';
import { Enrollment } from '../../../database/schemas/enrollment.schema';
import { Course } from '../../../database/schemas/course.schema';
import { User } from '../../../database/schemas/user.schema';

import { PendingPaymentDto } from '../dto/pending-payment.dto';

@Injectable()
export class GetPendingPaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,

    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async execute(): Promise<PendingPaymentDto[]> {
    const payments = await this.paymentModel
      .find({
        status: PaymentStatus.PENDING,
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    const result: PendingPaymentDto[] = [];

    for (const payment of payments) {
      /* ---------------------------------------
         Enrollment
      --------------------------------------- */

      const enrollment = await this.enrollmentModel
        .findById(payment.enrollmentId)
        .lean();

      if (!enrollment) {
        continue;
      }

      /* ---------------------------------------
         Student
      --------------------------------------- */

      const student = await this.userModel.findById(enrollment.userId).lean();

      /* ---------------------------------------
         Course
      --------------------------------------- */

      const course = await this.courseModel
        .findById(enrollment.courseId)
        .lean();

      if (!student || !course) {
        continue;
      }

      /* ---------------------------------------
         DTO Mapping
      --------------------------------------- */
      result.push({
        paymentId: payment._id.toString(),
        enrollmentId: enrollment._id.toString(),
        studentName: student.name,
        courseName: course.title,
        method: payment.method,
        status: payment.status,
        trxId: payment.trxId,
        amount: payment.amount,
        paidAt: payment.paidAt,
      });
    }

    return result;
  }
}
