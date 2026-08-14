import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Enrollment } from '../../../database/schemas/enrollment.schema';
import { User } from '../../../database/schemas/user.schema';
import { Course } from '../../../database/schemas/course.schema';
import { Payment } from '../../../database/schemas/payment.schema';

import { RecentEnrollmentDto } from '../dto/recent-enrollment.dto';

@Injectable()
export class GetRecentEnrollmentsService {
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) {}

  async execute(): Promise<RecentEnrollmentDto[]> {
    const enrollments = await this.enrollmentModel
      .find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

    const result: RecentEnrollmentDto[] = [];

    for (const enrollment of enrollments) {
      const user = await this.userModel.findById(enrollment.userId).lean();
      const course = await this.courseModel
        .findById(enrollment.courseId)
        .lean();
      const payment = await this.paymentModel
        .findOne({
          enrollmentId: enrollment._id,
        })
        .lean();

      if (!user || !course) {
        continue;
      }

      result.push({
        enrollmentId: enrollment._id.toString(),
        studentName: user.name,
        courseName: course.title,
        method: payment?.method ?? 'cash',
        status: enrollment.status,
        date: enrollment.createdAt,
      });
    }

    return result;
  }
}
