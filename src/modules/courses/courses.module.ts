import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Course, CourseSchema } from '../../database/schemas/course.schema';
import {
  Enrollment,
  EnrollmentSchema,
} from '../../database/schemas/enrollment.schema';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { Review, ReviewSchema } from '../../database/schemas/review.schema';
import {
  Certificate,
  CertificateSchema,
} from 'src/database/schemas/certificate.schema';

import { AdminFindAllCoursesService } from './service/admin-find-all-courses.service';
import { AdminCreateCourseService } from './service/admin-courses-create.service';
import { AdminFindCourseDetailsService } from './service/admin-find-courses-details.service';
import { AdminUpdateCourseService } from './service/admin-update-course.service';

import { PublicFindCourseDetailsService } from './service/public-find-course-details.service';
import { PublicFindCoursesService } from './service/public-find-courses.service';

import { StudentFindMyCoursesService } from './service/student-find-my-courses.service';
import { StudentFindCourseDetailsService } from './service/student-find-course-details.service';

import { PublicCoursesController } from './controller/public-courses.controller';
import { StudentCoursesController } from './controller/student-courses.controller';
import { StudentCancelEnrollmentService } from './service/student-cancel-enrollment.service';

import { AdminDeleteCourseService } from './service/admin-delete-course.service';
import { DeleteCourseController } from './controller/delete-course.controller';

import { CreateCourseController } from './controller/create-course.controller';
import { UpdateCourseController } from './controller/update-course.controller';
import { GetCourseDetailsController } from './controller/get-course-details.controller';
import { GetAllCoursesController } from './controller/get-all-courses.controller';

import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  controllers: [
    PublicCoursesController,
    StudentCoursesController,
    CreateCourseController,
    UpdateCourseController,
    GetCourseDetailsController,
    GetAllCoursesController,
    DeleteCourseController,
  ],
  providers: [
    AdminCreateCourseService,
    AdminFindAllCoursesService,
    AdminFindCourseDetailsService,
    AdminUpdateCourseService,

    PublicFindCoursesService,
    PublicFindCourseDetailsService,

    StudentFindMyCoursesService,
    StudentFindCourseDetailsService,
    StudentCancelEnrollmentService,

    AdminDeleteCourseService,
  ],
})
export class CoursesModule {}
