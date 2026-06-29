import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SeedService } from "./seed.service";

import { Course, CourseSchema } from "../database/schemas/course.schema";
import { Enrollment, EnrollmentSchema } from "../database/schemas/enrollment.schema";
import { Payment, PaymentSchema } from "src/database/schemas/payment.schema";
import { Otp, OtpSchema } from "../database/schemas/otp.schema";
import { User, UserSchema } from "../database/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule { }