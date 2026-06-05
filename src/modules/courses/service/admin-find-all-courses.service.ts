import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Course } from "../../../database/schemas/course.schema";
import { Enrollment } from "../../../database/schemas/enrollment.schema";

import { AdminFindAllCoursesResponseDto } from "../dto/admin-find-all-courses-response.dto";

@Injectable()
export class AdminFindAllCoursesService {
    constructor(
        @InjectModel(Course.name) private courseModel: Model<Course>,
        @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
    ) { }

    async findAll(): Promise<AdminFindAllCoursesResponseDto[]> {
        const courses = await this.courseModel.find().lean().exec();

        return Promise.all(courses.map(async (course) => {
            const enrollments =
                await this.enrollmentModel.find({
                    courseId: course._id,
                    status: "active",
                });

            const bookedSeats = enrollments.length;

            const revenue = enrollments.reduce((sum, enrollment) => {
                return sum + (enrollment.paymentSummary?.amount || 0);
            }, 0);

            const lessons =
                course.modules?.reduce(
                    (total, module) =>
                        total +
                        (module.classes.length || 0),
                    0,
                ) || 0;

            return {
                courseId: course._id.toString(),

                title: course.title,
                instructor: course.instructor,

                schedule: course.schedule,
                location: course.location,

                status: course.status,

                totalSeats: course.totalSeats,
                bookedSeats,

                revenue,
                lessons,
            };
        }));
    }
}