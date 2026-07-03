import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GetDashboardCoursesController } from './controllers/get-dashboard-courses.controller';
import { GetPendingPaymentsController } from './controllers/get-pending-payments.controller';
import { GetPendingPaymentsService } from './services/get-pending-payments.service';
import { GetDashboardCoursesService } from './services/get-dashboard-courses.service';
import { GetRecentEnrollmentsController } from './controllers/get-recent-enrollments.controller';
import { GetRecentEnrollmentsService } from './services/get-recent-enrollments.service';
import { GetDashboardStatsService } from './services/get-dashboard-stats.service';
import { GetDashboardStatsController } from './controllers/get-dashboard-stats.controller';

import { Course, CourseSchema } from '../../database/schemas/course.schema';
import {
    Enrollment,
    EnrollmentSchema,
} from '../../database/schemas/enrollment.schema';
import { Payment, PaymentSchema } from 'src/database/schemas/payment.schema';
import { User, UserSchema } from 'src/database/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Course.name, schema: CourseSchema },
            { name: Enrollment.name, schema: EnrollmentSchema },
            { name: Payment.name, schema: PaymentSchema },
        ]),
    ],
    controllers: [
        GetDashboardCoursesController,
        GetPendingPaymentsController,
        GetRecentEnrollmentsController,
        GetDashboardStatsController,
    ],
    providers: [
        GetDashboardCoursesService,
        GetPendingPaymentsService,
        GetRecentEnrollmentsService,
        GetDashboardStatsService,
    ],
})
export class AdminDashboardModule { }

