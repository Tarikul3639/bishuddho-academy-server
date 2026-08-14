import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Certificate,
  CertificateSchema,
} from '../database/schemas/certificate.schema';
import { Course, CourseSchema } from '../database/schemas/course.schema';
import {
  Enrollment,
  EnrollmentSchema,
} from '../database/schemas/enrollment.schema';
import { Otp, OtpSchema } from '../database/schemas/otp.schema';
import { Payment, PaymentSchema } from '../database/schemas/payment.schema';
import { Review, ReviewSchema } from '../database/schemas/review.schema';
import { Teacher, TeacherSchema } from '../database/schemas/teacher.schema';
import { User, UserSchema } from '../database/schemas/user.schema';
import { SeedService } from './seed.service';
import { CertificateSeedService } from './services/certificate.seed.service';
import { CourseSeedService } from './services/course.seed.service';
import { EnrollmentSeedService } from './services/enrollment.seed.service';
import { OtpSeedService } from './services/otp.seed.service';
import { PaymentSeedService } from './services/payment.seed.service';
import { ReviewSeedService } from './services/review.seed.service';
import { TeacherSeedService } from './services/teacher.seed.service';
import { UserSeedService } from './services/user.seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Certificate.name, schema: CertificateSchema },
    ]),
  ],
  providers: [
    SeedService,
    UserSeedService,
    TeacherSeedService,
    CourseSeedService,
    EnrollmentSeedService,
    PaymentSeedService,
    ReviewSeedService,
    CertificateSeedService,
    OtpSeedService,
  ],
  exports: [SeedService],
})
export class SeedModule {}
