import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Enrollment } from "../../../database/schemas/enrollment.schema";
import { Course } from "../../../database/schemas/course.schema";

import { StudentMyCourseResponseDto } from "../dto/student-my-course-response.dto";

@Injectable()
export class StudentFindMyCoursesService {
    constructor(
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
    ) {}

    async findMyCourses(
        userId: string,
    ): Promise<StudentMyCourseResponseDto[]> {
        const enrollments =
            await this.enrollmentModel
                .find({
                    userId: new Types.ObjectId(userId),
                })
                .populate("courseId")
                .lean()
                .exec();

        return enrollments.map((enrollment) => {
            const course =
                enrollment.courseId as unknown as Course & {
                    _id: Types.ObjectId;
                };

            const totalSessions =
                course.modules?.reduce(
                    (total, module) =>
                        total +
                        (module.classes?.length || 0),
                    0,
                ) || 0;

            return {
                courseId:
                    course._id.toString(),

                title:
                    course.title,

                thumbnailUrl:
                    course.thumbnailUrl,

                instructor:
                    course.instructor,

                status:
                    enrollment.status,

                schedule:
                    course.schedule,

                location:
                    course.location,

                duration:
                    course.duration,

                currentSession:
                    enrollment.currentSession ?? 0,

                totalSessions,
            };
        });
    }
}