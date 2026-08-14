import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { Teacher } from '../../database/schemas/teacher.schema';

@Injectable()
export class TeacherSeedService {
  private readonly logger = new Logger(TeacherSeedService.name);
  private readonly skills = [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'NestJS',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Python',
    'Figma',
    'Cybersecurity',
  ];
  private readonly designations = [
    'Senior Instructor',
    'Lead Software Engineer',
    'Technical Trainer',
    'Product Designer',
    'DevOps Engineer',
  ];

  constructor(
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Started');
    await this.teacherModel.deleteMany({}).exec();
    this.logger.log('Deleted existing data');
    const teachers = Array.from({ length: 15 }, (_, index) =>
      this.createTeacher(index),
    );
    await this.teacherModel.insertMany(teachers);
    this.logger.log(`Inserted ${teachers.length} teachers`);
    this.logger.log('Completed');
  }

  private createTeacher(index: number): Record<string, unknown> {
    const fullName = faker.person.fullName();
    const slug = `${this.slugify(fullName)}-${index + 1}`;
    return {
      fullName,
      slug,
      designation: faker.helpers.arrayElement(this.designations),
      shortBio: faker.person.bio(),
      biography: faker.lorem.paragraphs({ min: 2, max: 4 }),
      profileImage: faker.image.avatar(),
      profileImagePublicId: `teachers/${slug}`,
      email: `${slug}@bishuddhoacademy.test`,
      phone: `+8801${faker.string.numeric(9)}`,
      yearsOfExperience: faker.number.int({ min: 3, max: 20 }),
      skills: faker.helpers.arrayElements(this.skills, { min: 3, max: 6 }),
      socialLinks: {
        facebook: `https://facebook.com/${slug}`,
        linkedin: `https://linkedin.com/in/${slug}`,
        github: `https://github.com/${slug}`,
        website: `https://${slug}.dev`,
      },
      isActive: true,
      featured: index < 4,
      displayOrder: index + 1,
    };
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
