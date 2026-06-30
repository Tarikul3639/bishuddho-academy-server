// admin-users.module.ts

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "../../database/schemas/user.schema";
import {
    Enrollment,
    EnrollmentSchema,
} from "../../database/schemas/enrollment.schema";
import { Course, CourseSchema } from "../../database/schemas/course.schema";

import { AdminUsersController } from "./controller/admin-users.controller";
import { FindAllUsersService } from "./services/find-all-users.service";
import { FindUserDetailsService } from "./services/find-user-details.service";
import { ToggleUserBlockService } from "./services/toggle-user-block.service";
import { ResetUserPasswordService } from "./services/reset-user-password.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Enrollment.name, schema: EnrollmentSchema },
            { name: Course.name, schema: CourseSchema },
        ]),
    ],
    controllers: [AdminUsersController],
    providers: [
        FindAllUsersService,
        FindUserDetailsService,
        ToggleUserBlockService,
        ResetUserPasswordService,
    ],
})
export class AdminUsersModule {}
