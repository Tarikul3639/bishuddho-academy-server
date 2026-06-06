import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Course, CourseSchema } from '../../database/schemas/course.schema';
import {
    Enrollment,
    EnrollmentSchema,
} from '../../database/schemas/enrollment.schema';
import { Review, ReviewSchema } from 'src/database/schemas/review.schema';

import { AdminFindAllCoursesService } from './service/admin-find-all-courses.service';
import { AdminCreateCourseService } from './service/admin-courses-create.service';
import { AdminFindCourseDetailsService } from './service/admin-find-courses-details.service';
import { AdminUpdateCourseService } from './service/admin-update-course.service';

import { PublicFindCourseDetailsService } from "./service/public-find-course-details.service";
import { PublicFindCoursesService } from "./service/public-find-courses.service";

import { StudentFindMyCoursesService } from "./service/student-find-my-courses.service";
import { StudentFindCourseDetailsService } from "./service/student-find-course-details.service";

import { AdminCoursesController } from './controller/admin-courses.controller';
import { PublicCoursesController } from './controller/public-courses.controller';
import { StudentCoursesController } from './controller/student-courses.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Course.name, schema: CourseSchema },
            { name: Enrollment.name, schema: EnrollmentSchema },
            { name: Review.name, schema: ReviewSchema },
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
    controllers: [AdminCoursesController, PublicCoursesController, StudentCoursesController],
    providers: [
        AdminCreateCourseService,
        AdminFindAllCoursesService,
        AdminFindCourseDetailsService,
        AdminUpdateCourseService,
        
        PublicFindCoursesService,
        PublicFindCourseDetailsService,

        StudentFindMyCoursesService,
        StudentFindCourseDetailsService,
    ],
})
export class CoursesModule { }
