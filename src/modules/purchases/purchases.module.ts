import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Enrollment, EnrollmentSchema } from '../../database/schemas/enrollment.schema';
import { Course, CourseSchema } from '../../database/schemas/course.schema';

import { PurchasesController } from './controller/purchases.controller';
import { CreatePurchaseService } from './service/create-purchase.service';
import { AdminPurchasesService } from './service/admin-purchases.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Enrollment.name, schema: EnrollmentSchema },
            { name: Course.name, schema: CourseSchema },
        ]),
    ],
    controllers: [PurchasesController],
    providers: [CreatePurchaseService, AdminPurchasesService],
})
export class PurchasesModule {}
