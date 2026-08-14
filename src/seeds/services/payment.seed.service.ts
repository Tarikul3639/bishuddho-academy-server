import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { Model, Types } from 'mongoose';
import { Course } from '../../database/schemas/course.schema';
import { Enrollment } from '../../database/schemas/enrollment.schema';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../../database/schemas/payment.schema';
import { User, UserRole } from '../../database/schemas/user.schema';

@Injectable()
export class PaymentSeedService {
  private readonly logger = new Logger(PaymentSeedService.name);
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Started');
    await this.paymentModel.deleteMany({}).exec();
    this.logger.log('Deleted existing data');
    const [enrollments, courses, admin] = await Promise.all([
      this.enrollmentModel
        .find({})
        .select({ _id: 1, courseId: 1, createdAt: 1 })
        .lean()
        .exec(),
      this.courseModel.find({}).select({ _id: 1, price: 1 }).lean().exec(),
      this.userModel
        .findOne({ role: UserRole.ADMIN })
        .select({ _id: 1 })
        .lean()
        .exec(),
    ]);
    if (!admin) throw new Error('Payments require an admin user.');
    const priceByCourse = new Map(
      courses.map((course) => [course._id.toString(), course.price]),
    );
    const payments = enrollments.map((enrollment) =>
      this.createPayment(
        enrollment._id,
        enrollment.createdAt,
        priceByCourse.get(enrollment.courseId.toString()) ?? 0,
        admin._id,
      ),
    );
    await this.paymentModel.insertMany(payments);
    this.logger.log(`Inserted ${payments.length} payments`);
    this.logger.log('Completed');
  }

  private createPayment(
    enrollmentId: Types.ObjectId,
    enrolledAt: Date,
    amount: number,
    adminId: Types.ObjectId,
  ): Record<string, unknown> {
    const status = faker.helpers.weightedArrayElement([
      { value: PaymentStatus.VERIFIED, weight: 8 },
      { value: PaymentStatus.PENDING, weight: 1 },
      { value: PaymentStatus.REJECTED, weight: 1 },
    ]);
    const paidAt = faker.date.between({ from: enrolledAt, to: new Date() });
    return {
      enrollmentId,
      method: faker.helpers.arrayElement(Object.values(PaymentMethod)),
      trxId: `TRX-${faker.string.alphanumeric({ length: 14, casing: 'upper' })}`,
      amount,
      paidAt,
      status,
      ...(status === PaymentStatus.VERIFIED
        ? {
            verifiedBy: adminId,
            verifiedAt: faker.date.between({ from: paidAt, to: new Date() }),
          }
        : {}),
      ...(status === PaymentStatus.REJECTED
        ? {
            rejectionReason: faker.helpers.arrayElement([
              'Transaction could not be verified',
              'Payment reference did not match',
              'Duplicate payment submission',
            ]),
          }
        : {}),
    };
  }
}
