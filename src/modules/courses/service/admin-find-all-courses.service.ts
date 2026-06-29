// service/admin-find-all-courses.service.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Course } from "../../../database/schemas/course.schema";
import {
  Enrollment,
  EnrollmentStatus,
} from "../../../database/schemas/enrollment.schema";
import {
  Payment,
  PaymentStatus,
} from "../../../database/schemas/payment.schema";

import { AdminFindAllCoursesResponseDto } from "../dto/admin-find-all-courses-response.dto";

@Injectable()
export class AdminFindAllCoursesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) {}

  async findAll(): Promise<AdminFindAllCoursesResponseDto[]> {
    const courses = await this.courseModel.find().lean().exec();

    return Promise.all(
      courses.map(async (course) => {
        const enrollments = await this.enrollmentModel
          .find({
            courseId: course._id,
            status: EnrollmentStatus.ACTIVE,
          })
          .lean()
          .exec();

        const bookedSeats = enrollments.length;
        const enrollmentIds = enrollments.map((e) => e._id);

        const payments = await this.paymentModel
          .find({
            enrollmentId: { $in: enrollmentIds },
            status: PaymentStatus.VERIFIED,
          })
          .lean()
          .exec();

        const revenue = payments.reduce(
          (sum, payment) => sum + payment.amount,
          0,
        );

        const lessons =
          course.modules?.reduce(
            (total, module) => total + (module.classes?.length || 0),
            0,
          ) || 0;

        return {
          courseId: course._id.toString(),
          title: course.title,
          instructor: course.instructor,
          schedule: course.schedule,
          location: course.location,
          status: course.status,
          totalSeats: course.totalSeats,
          bookedSeats,
          revenue,
          lessons,
        };
      }),
    );
  }
}