import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { Model, Types } from 'mongoose';
import { Course } from '../../database/schemas/course.schema';
import {
  Enrollment,
  EnrollmentStatus,
} from '../../database/schemas/enrollment.schema';
import { User, UserRole } from '../../database/schemas/user.schema';

@Injectable()
export class EnrollmentSeedService {
  private readonly logger = new Logger(EnrollmentSeedService.name);
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Started');
    await this.enrollmentModel.deleteMany({}).exec();
    this.logger.log('Deleted existing data');
    const [students, courses] = await Promise.all([
      this.userModel
        .find({ role: UserRole.STUDENT })
        .select({ _id: 1 })
        .lean()
        .exec(),
      this.courseModel.find({}).select({ _id: 1 }).lean().exec(),
    ]);
    const enrollments = students.flatMap((student) =>
      this.createForStudent(
        student._id,
        courses.map((course) => course._id),
      ),
    );
    await this.enrollmentModel.insertMany(enrollments);
    this.logger.log(`Inserted ${enrollments.length} enrollments`);
    this.logger.log('Completed');
  }

  private createForStudent(
    userId: Types.ObjectId,
    courseIds: Types.ObjectId[],
  ): Array<Record<string, unknown>> {
    const selected = faker.helpers.arrayElements(courseIds, {
      min: 1,
      max: Math.min(3, courseIds.length),
    });
    return selected.map((courseId) => ({
      userId,
      courseId,
      status: faker.helpers.weightedArrayElement([
        { value: EnrollmentStatus.ACTIVE, weight: 8 },
        { value: EnrollmentStatus.PENDING, weight: 1 },
        { value: EnrollmentStatus.CANCELLED, weight: 1 },
      ]),
      createdAt: faker.date.recent({ days: 120 }),
    }));
  }
}
