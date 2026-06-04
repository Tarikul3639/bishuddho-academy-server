import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Course } from "../database/schemas/course.schema";
import { Enrollment } from "../database/schemas/enrollment.schema";
import { Otp } from "../database/schemas/otp.schema";
import { User } from "../database/schemas/user.schema";

/* DATA */


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
  ) {}

  async seed() {
    console.log("🌱 Starting database seeding...");

    /* -------------------------------- */
    /* CLEAR All DATABASE BEFORE SEEDING */
    /* -------------------------------- */

    // await Promise.all([
    //   this.seriesModel.deleteMany({}),
    //   this.episodeModel.deleteMany({}),
    //   this.movieModel.deleteMany({}),
    // ]);

    // console.log("🗑 Existing data cleared");

    /* -------------------------------- */
    /* SERIES DATA FILES */
    /* -------------------------------- */

    const COURSE_COLLECTIONS = [
    ];

    /* -------------------------------- */
    /* INSERT COURSES */
    /* -------------------------------- */

    // for (const item of COURSE_COLLECTIONS) {
    //   /* CREATE COURSE */

    //   const createdCourse = await this.courseModel.create({
    //     ...item.course,
    //   });

    //   console.log(`📺 Course created: ${createdCourse.title}`);

    //   /* CREATE MODULES */

    //   const formattedModules = item.modules.map((module) => ({
    //     ...module,

    //     course: createdCourse._id,
    //   }));

    //   await this.moduleModel.insertMany(formattedModules);

    //   console.log(
    //     `🎬 ${formattedModules.length} modules added for ${createdCourse.title}`
    //   );
    // }

    console.log("✅ Database seeding completed successfully!");
  }
}