// src/seeds/seed.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { CertificateSeedService } from './services/certificate.seed.service';
import { CourseSeedService } from './services/course.seed.service';
import { EnrollmentSeedService } from './services/enrollment.seed.service';
import { OtpSeedService } from './services/otp.seed.service';
import { PaymentSeedService } from './services/payment.seed.service';
import { ReviewSeedService } from './services/review.seed.service';
import { TeacherSeedService } from './services/teacher.seed.service';
import { UserSeedService } from './services/user.seed.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly userSeedService: UserSeedService,
    private readonly teacherSeedService: TeacherSeedService,
    private readonly courseSeedService: CourseSeedService,
    private readonly enrollmentSeedService: EnrollmentSeedService,
    private readonly paymentSeedService: PaymentSeedService,
    private readonly reviewSeedService: ReviewSeedService,
    private readonly certificateSeedService: CertificateSeedService,
    private readonly otpSeedService: OtpSeedService,
  ) {}

  async seed(): Promise<void> {
    this.logger.log('Starting database seed');

    await this.userSeedService.run();
    await this.teacherSeedService.run();
    await this.courseSeedService.run();
    await this.enrollmentSeedService.run();
    await this.paymentSeedService.run();
    await this.reviewSeedService.run();
    await this.certificateSeedService.run();
    await this.otpSeedService.run();

    this.logger.log('Database seed completed');
  }
}
