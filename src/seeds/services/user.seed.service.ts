import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserRole, UserStatus } from '../../database/schemas/user.schema';

@Injectable()
export class UserSeedService {
  private readonly logger = new Logger(UserSeedService.name);
  private readonly password = 'password123';
  private readonly departments = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Cyber Security',
  ];
  private readonly programs = [
    'Diploma in Engineering',
    'BSc in CSE',
    'Professional Certificate',
  ];
  private readonly semesters = [
    '1st',
    '2nd',
    '3rd',
    '4th',
    '5th',
    '6th',
    '7th',
    '8th',
  ];

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Started');
    await this.userModel.deleteMany({}).exec();
    this.logger.log('Deleted existing data');
    const password = await bcrypt.hash(this.password, 10);
    const users = [
      this.createAdmin(password),
      ...Array.from({ length: 50 }, (_, index) =>
        this.createStudent(index, password),
      ),
    ];
    await this.userModel.insertMany(users);
    this.logger.log(`Inserted ${users.length} users`);
    this.logger.log('Completed');
  }

  private createAdmin(password: string): Record<string, unknown> {
    return this.createUserProfile({
      index: 0,
      password,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      name: 'System Administrator',
      email: 'admin@bishuddhoacademy.com',
      emailVerified: true,
    });
  }

  private createStudent(
    index: number,
    password: string,
  ): Record<string, unknown> {
    const sex = faker.helpers.arrayElement(['male', 'female'] as const);
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName();
    return this.createUserProfile({
      index: index + 1,
      password,
      role: UserRole.STUDENT,
      status: faker.helpers.weightedArrayElement([
        { value: UserStatus.ACTIVE, weight: 9 },
        { value: UserStatus.BLOCKED, weight: 1 },
      ]),
      name: `${firstName} ${lastName}`,
      email: `student.${String(index + 1).padStart(3, '0')}.${faker.string.alphanumeric(6).toLowerCase()}@bishuddhoacademy.test`,
      emailVerified: faker.datatype.boolean(0.85),
      sex,
    });
  }

  private createUserProfile(input: {
    index: number;
    password: string;
    role: UserRole;
    status: UserStatus;
    name: string;
    email: string;
    emailVerified: boolean;
    sex?: 'male' | 'female';
  }): Record<string, unknown> {
    const sex = input.sex ?? 'male';
    const guardianRelationship = faker.helpers.arrayElement([
      'Father',
      'Mother',
      'Sibling',
      'Spouse',
      'Friend',
      'Other',
    ]);
    const now = new Date();
    return {
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      status: input.status,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=random`,
      lastLogin: faker.date.recent({ days: 30 }),
      emailVerified: input.emailVerified,
      emailVerificationToken: faker.string.alphanumeric(48),
      emailVerificationExpires: faker.date.soon({ days: 7 }),
      passwordResetToken: faker.string.alphanumeric(48),
      passwordResetExpires: faker.date.soon({ days: 2 }),
      phone: this.bangladeshPhone(),
      alternativePhone: this.bangladeshPhone(),
      dateOfBirth: faker.date.birthdate({ min: 18, max: 30, mode: 'age' }),
      gender: sex === 'male' ? 'Male' : 'Female',
      bloodGroup: faker.helpers.arrayElement([
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-',
      ]),
      religion: 'Islam',
      nationality: 'Bangladeshi',
      nidNumber: this.digits(10),
      birthRegistrationNumber: this.digits(17),
      passportNumber: `A${this.digits(8)}`,
      rollNumber: `BA-${now.getFullYear()}-${String(input.index).padStart(4, '0')}`,
      registrationNumber: `REG-${now.getFullYear()}-${String(input.index).padStart(5, '0')}`,
      session: `${now.getFullYear()}-${String(now.getFullYear() + 1).slice(-2)}`,
      department: faker.helpers.arrayElement(this.departments),
      program: faker.helpers.arrayElement(this.programs),
      semester: faker.helpers.arrayElement(this.semesters),
      batch: `Batch ${faker.number.int({ min: 1, max: 12 })}`,
      admissionDate: faker.date.past({ years: 3 }),
      fatherName: faker.person.fullName({ sex: 'male' }),
      motherName: faker.person.fullName({ sex: 'female' }),
      guardianName: faker.person.fullName(),
      guardianPhone: this.bangladeshPhone(),
      guardianOccupation: faker.person.jobTitle(),
      emergencyContactName: faker.person.fullName(),
      emergencyContactNumber: this.bangladeshPhone(),
      relationship: guardianRelationship,
      presentAddress: `${faker.location.streetAddress()}, ${faker.location.city()}, Bangladesh`,
      permanentAddress: `${faker.location.streetAddress()}, ${faker.location.city()}, Bangladesh`,
    };
  }

  private bangladeshPhone(): string {
    return `+8801${faker.string.numeric(9)}`;
  }
  private digits(length: number): string {
    return faker.string.numeric(length);
  }
}
