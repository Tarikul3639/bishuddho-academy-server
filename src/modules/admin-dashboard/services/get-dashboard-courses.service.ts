import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Course, CourseModule } from '../../../database/schemas/course.schema';

import {
  Enrollment,
  EnrollmentStatus,
} from '../../../database/schemas/enrollment.schema';

import {
  Payment,
  PaymentStatus,
} from '../../../database/schemas/payment.schema';

import { DashboardCourseDto } from '../../admin-dashboard/dto/dashboard-course.dto';

@Injectable()
export class GetDashboardCoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) {}

  async execute(): Promise<DashboardCourseDto[]> {
    const courses = await this.courseModel
      .find()
      .sort({ createdAt: -1 })
      .lean();

    const result: DashboardCourseDto[] = [];

    for (const course of courses) {
      /* -----------------------------
               Booked Seats
            ------------------------------ */

      const enrollments = await this.enrollmentModel.find({
        courseId: course._id,
        status: {
          $in: [EnrollmentStatus.ACTIVE],
        },
      });

      const bookedSeats = enrollments.length;

      /* -----------------------------
               Lessons
            ------------------------------ */

      const lessons = course.modules.reduce(
        (total: number, module: CourseModule) => total + module.classes.length,
        0,
      );

      /* -----------------------------
               Revenue
            ------------------------------ */

      let revenue = 0;

      for (const enrollment of enrollments) {
        const payment = await this.paymentModel.findOne({
          enrollmentId: enrollment._id,
          status: PaymentStatus.VERIFIED,
        });

        if (payment) {
          revenue += payment.amount;
        }
      }

      /* -----------------------------
               Response
            ------------------------------ */

      result.push({
        courseId: course._id.toString(),
        title: course.title,
        instructor: course.instructor,
        schedule: course.schedule,
        location: course.location,
        duration: course.duration,
        status: course.status,
        totalSeats: course.totalSeats,
        bookedSeats,
        lessons,
        revenue,
        startDate: course.startDate,
      });
    }

    return result;
  }
}
