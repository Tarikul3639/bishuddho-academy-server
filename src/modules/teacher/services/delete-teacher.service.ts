import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Teacher } from "../../../database/schemas/teacher.schema";

import { CloudinaryService } from "../../../common/cloudinary/cloudinary.service";

@Injectable()
export class DeleteTeacherService {
    constructor(
        @InjectModel(Teacher.name)
        private readonly teacherModel: Model<Teacher>,

        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async delete(
        teacherId: string,
    ) {
        const teacher =
            await this.teacherModel
                .findById(teacherId)
                .exec();

        if (!teacher) {
            throw new NotFoundException(
                `Teacher with ID "${teacherId}" not found`,
            );
        }

        if (
            teacher.profileImagePublicId
        ) {
            await this.cloudinaryService.deleteFile(
                teacher.profileImagePublicId,
            );
        }

        await teacher.deleteOne();

        return {
            success: true,
            message:
                "Teacher deleted successfully.",
            teacherId,
        };
    }
}