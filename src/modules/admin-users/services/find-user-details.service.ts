// service/find-user-details.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { User, UserRole } from "../../../database/schemas/user.schema";
import { Enrollment, EnrollmentStatus } from "../../../database/schemas/enrollment.schema";
import { Course } from "../../../database/schemas/course.schema";
import { UserDetailDto } from "../dto/admin-users-response.dto";

@Injectable()
export class FindUserDetailsService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,
    ) {}

    async findById(id: string): Promise<UserDetailDto> {
        const user = await this.userModel.findById(new Types.ObjectId(id)).lean().exec();

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const enrollments = await this.enrollmentModel
            .find({ userId: user._id, status: EnrollmentStatus.ACTIVE })
            .populate("courseId", "title")
            .lean()
            .exec();

        const coursesCount = enrollments.length;

        return {
            id: user._id.toString() || "",
            name: user.name || "",
            email: user.email || "",
            studentId: user.studentId || undefined,
            phone: user.phone || undefined,
            avatarUrl: user.avatarUrl || undefined,
            role: user.role || UserRole.STUDENT,
            status: user.status || "active",
            joinedDate: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  })
                : undefined,
            lastLogin: user.lastLogin
                ? new Date(user.lastLogin).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  })
                : undefined,
            dateOfBirth: user.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                  })
                : undefined,
            gender: user.gender || undefined,
            bloodGroup: user.bloodGroup || undefined,
            batch: user.batch || undefined,
            department: user.department || undefined,
            program: user.program || undefined,
            semester: user.semester || undefined,
            fatherName: user.fatherName || undefined,
            motherName: user.motherName || undefined,
            guardianName: user.guardianName || undefined,
            guardianPhone: user.guardianPhone || undefined,
            presentAddress: user.presentAddress || undefined,
            permanentAddress: user.permanentAddress || undefined,
            coursesCount: coursesCount || 0,
        };
    }
}
