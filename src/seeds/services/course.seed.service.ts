import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { Course, CourseStatus } from '../../database/schemas/course.schema';
import { Teacher } from '../../database/schemas/teacher.schema';

@Injectable()
export class CourseSeedService {
  private readonly logger = new Logger(CourseSeedService.name);
  private readonly subjects = [
    'Full Stack JavaScript',
    'Modern React',
    'Python for Data Science',
    'Cybersecurity',
    'UI/UX Design',
    'DevOps Engineering',
    'Flutter Development',
    'Cloud Computing',
    'Machine Learning',
    'Backend Engineering',
    'Product Management',
    'Digital Marketing',
  ];
  private readonly topics = [
    'Introduction and roadmap',
    'Development environment',
    'Core concepts',
    'Hands-on workshop',
    'Real-world patterns',
    'Testing and quality',
    'Deployment strategy',
    'Capstone project',
  ];
  private readonly includes = [
    'Live instructor-led classes',
    'Recorded class videos',
    'Practical assignments',
    'Project source code',
    'Private community access',
    'Career guidance',
    'Completion certificate',
    'Premium support',
  ];

  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Started');
    await this.courseModel.deleteMany({}).exec();
    this.logger.log('Deleted existing data');
    const teachers = await this.teacherModel
      .find({ isActive: true })
      .select({ fullName: 1 })
      .lean()
      .exec();
    if (teachers.length === 0)
      throw new Error('Courses require at least one active teacher.');
    const courses = Array.from({ length: 12 }, (_, index) =>
      this.createCourse(index, faker.helpers.arrayElement(teachers).fullName),
    );
    await this.courseModel.insertMany(courses);
    this.logger.log(`Inserted ${courses.length} courses`);
    this.logger.log('Completed');
  }

  private createCourse(
    index: number,
    instructor: string,
  ): Record<string, unknown> {
    const title = `${this.subjects[index]} Masterclass`;
    const originalPrice = faker.number.int({
      min: 6000,
      max: 18000,
      multipleOf: 500,
    });
    const price =
      originalPrice -
      faker.number.int({ min: 500, max: 3000, multipleOf: 500 });
    const startDate = faker.date.soon({ days: 90 });
    return {
      title,
      tagline: faker.company.catchPhrase(),
      description: `${faker.lorem.paragraphs(2)}\n\n${faker.lorem.paragraph()}`,
      thumbnailUrl: faker.image.urlPicsumPhotos({ width: 1280, height: 720 }),
      thumbnailPublicId: `courses/${this.slugify(title)}`,
      instructor,
      startDate,
      schedule: faker.helpers.arrayElement([
        'Friday & Saturday, 8:00 PM',
        'Tuesday & Thursday, 9:00 PM',
        'Monday & Wednesday, 7:30 PM',
      ]),
      location: faker.helpers.arrayElement([
        'Online',
        'Dhaka Learning Centre',
        'Hybrid - Dhaka',
      ]),
      duration: `${faker.number.int({ min: 8, max: 24 })} weeks`,
      totalSeats: faker.number.int({ min: 25, max: 80 }),
      price,
      originalPrice,
      discountStarts: faker.date.recent({ days: 5 }),
      discountEnds: faker.date.soon({ days: 21 }),
      status: faker.helpers.weightedArrayElement([
        { value: CourseStatus.ACTIVE, weight: 7 },
        { value: CourseStatus.UPCOMING, weight: 2 },
        { value: CourseStatus.COMPLETED, weight: 1 },
      ]),
      averageRating: 0,
      reviewCount: 0,
      includes: faker.helpers.arrayElements(this.includes, { min: 4, max: 7 }),
      modules: this.createModules(),
    };
  }

  private createModules(): Array<Record<string, unknown>> {
    const moduleCount = faker.number.int({ min: 4, max: 7 });
    return Array.from({ length: moduleCount }, (_, moduleIndex) => {
      const classCount = faker.number.int({ min: 3, max: 5 });
      return {
        title: `Module ${moduleIndex + 1}: ${this.topics[moduleIndex]}`,
        classes: Array.from({ length: classCount }, (_, classIndex) => ({
          title: `${this.topics[(moduleIndex + classIndex) % this.topics.length]}`,
          session: `Class ${moduleIndex + 1}.${classIndex + 1}`,
          completed: false,
        })),
      };
    });
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
