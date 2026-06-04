import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from '../../../database/schemas/course.schema';
import { CreateCourseDto } from '../dto/create-course.dto';

@Injectable()
export class CreateCourseService {
    constructor(
        @InjectModel(Course.name) private courseModel: Model<Course>,
    ) { }

    /* CREATE COURSE */
    async create(data: CreateCourseDto, thumbnailFile?: Express.Multer.File) {
        console.log("Creating..", data, thumbnailFile);
        const thumbnailUrl = thumbnailFile
            ? `/uploads/courses/thumbnails/${thumbnailFile.filename}`
            : "";
        const course = await this.courseModel.create({
            ...data,
            thumbnailUrl,
        });

        if (!course) {
            throw new NotFoundException('Failed to create course');
        }

        return course;
    }
}