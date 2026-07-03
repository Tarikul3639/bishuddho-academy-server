import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
    Enrollment,
    EnrollmentSchema,
} from '../../database/schemas/enrollment.schema';
import { Payment, PaymentSchema } from '../../database/schemas/payment.schema';
import { Course, CourseSchema } from '../../database/schemas/course.schema';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { CommonModule } from '../../common/common.module';

import { PurchasesController } from './controller/purchases.controller';
import { CreatePurchaseService } from './service/create-purchase.service';
import { AdminPurchasesService } from './service/admin-purchases.service';
import { UpdatePurchaseStatusService } from './service/update-purchase-status.service';

@Module({
    imports: [
        CommonModule,
        MongooseModule.forFeature([
            { name: Enrollment.name, schema: EnrollmentSchema },
            { name: Payment.name, schema: PaymentSchema },
            { name: Course.name, schema: CourseSchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    controllers: [PurchasesController],
    providers: [
        CreatePurchaseService,
        AdminPurchasesService,
        UpdatePurchaseStatusService,
    ],
})
export class PurchasesModule { }
