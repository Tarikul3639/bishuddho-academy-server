import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Course } from "../database/schemas/course.schema";
import { Enrollment } from "../database/schemas/enrollment.schema";
import { Otp } from "../database/schemas/otp.schema";
import { User } from "../database/schemas/user.schema";

import { COURSE_COLLECTIONS } from "./data/course.data";

@Injectable()
export class SeedService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        @InjectModel(Otp.name)
        private readonly otpModel: Model<Otp>,

        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,

        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
    ) { }

    async seed() {
        console.log("🌱 Starting database seeding...");

        /* Clear database */
        await Promise.all([
            this.userModel.deleteMany({}),
            this.otpModel.deleteMany({}),
            this.courseModel.deleteMany({}),
            this.enrollmentModel.deleteMany({}),
        ]);

        console.log("🗑 Existing data cleared");

        /* Insert courses */
        await this.courseModel.insertMany(COURSE_COLLECTIONS);

        console.log(
            "✅ Database seeding completed successfully!",
        );

        return {
            success: true,
            totalCourses:
                COURSE_COLLECTIONS.length,
        };
    }
}