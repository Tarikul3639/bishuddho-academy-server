import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { Certificate } from '../../database/schemas/certificate.schema';
import {
  Enrollment,
  EnrollmentStatus,
} from '../../database/schemas/enrollment.schema';
import { User, UserRole } from '../../database/schemas/user.schema';

@Injectable()
export class CertificateSeedService {
  private readonly logger = new Logger(CertificateSeedService.name);
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Started');
    await this.certificateModel.deleteMany({}).exec();
    this.logger.log('Deleted existing data');
    const [enrollments, admin] = await Promise.all([
      this.enrollmentModel
        .find({ status: EnrollmentStatus.ACTIVE })
        .select({ _id: 1, userId: 1, courseId: 1, createdAt: 1 })
        .lean()
        .exec(),
      this.userModel
        .findOne({ role: UserRole.ADMIN })
        .select({ _id: 1 })
        .lean()
        .exec(),
    ]);
    if (!admin) throw new Error('Certificates require an admin user.');
    const certificates = enrollments.map((enrollment, index) => {
      const certificateNo = `BA-${new Date().getFullYear()}-${String(index + 1).padStart(6, '0')}`;
      return {
        enrollmentId: enrollment._id,
        studentId: enrollment.userId,
        courseId: enrollment.courseId,
        certificateNo,
        pdfUrl: `https://res.cloudinary.com/bishuddho-academy/raw/upload/certificates/${certificateNo}.pdf`,
        uploadedBy: admin._id,
        cloudinaryPublicId: `certificates/${certificateNo}`,
        issuedAt: faker.date.between({
          from: enrollment.createdAt,
          to: new Date(),
        }),
      };
    });
    await this.certificateModel.insertMany(certificates);
    this.logger.log(`Inserted ${certificates.length} certificates`);
    this.logger.log('Completed');
  }
}
