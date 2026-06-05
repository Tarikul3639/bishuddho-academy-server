import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { promises as fs } from "fs";
import { join } from "path";

import { Course } from "../../../database/schemas/course.schema";

import { AdminUpdateCourseDto } from "../dto/admin-update-course.dto";

@Injectable()
export class AdminUpdateCourseService {
    constructor(
        @InjectModel(Course.name)
        private courseModel: Model<Course>,
    ) {}

    async update(
        courseId: string,
        thumbnailFile: Express.Multer.File,
        data: AdminUpdateCourseDto,
    ) {
        const existingCourse =
            await this.courseModel
                .findById(courseId)
                .lean()
                .exec();

        if (!existingCourse) {
            throw new NotFoundException(
                "Course not found",
            );
        }

        const oldThumbnailUrl =
            existingCourse.thumbnailUrl;

        if (thumbnailFile) {
            data.thumbnailUrl =
                `/uploads/courses/thumbnails/${thumbnailFile.filename}`;
        }

        const updatedCourse =
            await this.courseModel.findByIdAndUpdate(
                courseId,
                data,
                {
                    returnDocument: "after",
                    runValidators: true,
                },
            );

        if (!updatedCourse) {
            throw new NotFoundException(
                "Course not found",
            );
        }

        if (
            thumbnailFile &&
            oldThumbnailUrl
        ) {
            try {
                const oldPath = join(
                    process.cwd(),
                    "public",
                    oldThumbnailUrl,
                );

                await fs.unlink(oldPath);
            } catch (error) {
                console.error(
                    "Failed to delete old thumbnail:",
                    error,
                );
            }
        }

        return updatedCourse;
    }
}