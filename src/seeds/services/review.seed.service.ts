import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { Course } from '../../database/schemas/course.schema';
import { Enrollment } from '../../database/schemas/enrollment.schema';
import { Review } from '../../database/schemas/review.schema';

@Injectable()
export class ReviewSeedService {
  private readonly logger = new Logger(ReviewSeedService.name);
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Started');
    await this.reviewModel.deleteMany({}).exec();
    this.logger.log('Deleted existing data');
    const enrollments = await this.enrollmentModel
      .find({})
      .select({ userId: 1, courseId: 1 })
      .lean()
      .exec();
    const reviews = enrollments
      .filter(() => faker.datatype.boolean(0.65))
      .map((enrollment) => ({
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentences({ min: 1, max: 3 }),
        isPublished: faker.datatype.boolean(0.9),
      }));
    await this.reviewModel.insertMany(reviews);
    await this.updateCourseRatings();
    this.logger.log(`Inserted ${reviews.length} reviews`);
    this.logger.log('Completed');
  }

  private async updateCourseRatings(): Promise<void> {
    const courses = await this.courseModel
      .find({})
      .select({ _id: 1 })
      .lean()
      .exec();
    await Promise.all(
      courses.map(async (course) => {
        const reviews = await this.reviewModel
          .find({ courseId: course._id, isPublished: true })
          .select({ rating: 1 })
          .lean()
          .exec();
        const averageRating =
          reviews.length === 0
            ? 0
            : Number(
                (
                  reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
                ).toFixed(2),
              );
        await this.courseModel
          .updateOne(
            { _id: course._id },
            { $set: { averageRating, reviewCount: reviews.length } },
          )
          .exec();
      }),
    );
  }
}
