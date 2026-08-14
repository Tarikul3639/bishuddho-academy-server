import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Certificate,
  CertificateSchema,
} from '../../database/schemas/certificate.schema';

import {
  Enrollment,
  EnrollmentSchema,
} from '../../database/schemas/enrollment.schema';

import { Course, CourseSchema } from '../../database/schemas/course.schema';

import { User, UserSchema } from '../../database/schemas/user.schema';

import { CloudinaryModule } from '../../common/cloudinary/cloudinary.module';

import { UploadCertificateController } from './controllers/upload-certificate.controller';
import { GetCourseCertificatesController } from './controllers/get-course-certificates.controller';

import { UploadCertificateService } from './services/upload-certificate.service';
import { GetCourseCertificatesService } from './services/get-course-certificates.service';

import { GetMyCertificatesController } from './controllers/get-my-certificates.controller';
import { DownloadCertificateController } from './controllers/download-certificate.controller';

import { GetMyCertificatesService } from './services/get-my-certificates.service';
import { DownloadCertificateService } from './services/download-certificate.service';

import { ViewCertificateService } from './services/view-certificate.service';
import { ViewCertificateController } from './controllers/view-certificate.controller';

import { DeleteCertificateController } from './controllers/delete-certificate.controller';
import { DeleteCertificateService } from './services/delete-certificate.service';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Certificate.name,
        schema: CertificateSchema,
      },
      {
        name: Enrollment.name,
        schema: EnrollmentSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],

  controllers: [
    UploadCertificateController,
    GetCourseCertificatesController,
    GetMyCertificatesController,
    DownloadCertificateController,
    ViewCertificateController,
    DeleteCertificateController,
  ],

  providers: [
    UploadCertificateService,
    GetCourseCertificatesService,
    GetMyCertificatesService,
    DownloadCertificateService,
    ViewCertificateService,
    DeleteCertificateService,
  ],

  exports: [
    UploadCertificateService,
    GetCourseCertificatesService,
    GetMyCertificatesService,
    DownloadCertificateService,
    ViewCertificateService,
    DeleteCertificateService,
  ],
})
export class CertificateModule {}
