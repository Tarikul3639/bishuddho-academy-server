// service/find-all-users.service.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { User, UserRole } from "../../../database/schemas/user.schema";
import { Enrollment } from "../../../database/schemas/enrollment.schema";
import { UserSummaryDto, UserSummaryResponseDto } from "../dto/admin-users-response.dto";

@Injectable()
export class FindAllUsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
    ) {}

    async findAll(query?: {
        search?: string;
        status?: string;
    }): Promise<UserSummaryResponseDto> {
        const filter: any = { role: UserRole.STUDENT };

        if (query?.status) {
            filter.status = query.status;
        }

        if (query?.search) {
            const regex = new RegExp(query.search, "i");
            filter.$or = [
                { name: regex },
                { email: regex },
                { studentId: regex },
            ];
        }

        const users = await this.userModel
            .find(filter)
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        const userIds = users.map((u) => u._id);
        const enrollments = await this.enrollmentModel
            .find({ userId: { $in: userIds } })
            .populate("courseId", "title")
            .lean()
            .exec();

        const countByCourse = new Map<string, number>();
        const lastPurchaseByUser = new Map<string, string>();

        for (const enrollment of enrollments) {
            const uid = (enrollment.userId as Types.ObjectId).toString();
            countByCourse.set(uid, (countByCourse.get(uid) || 0) + 1);

            const course = enrollment.courseId as any;
            const date = (enrollment as any).createdAt
                ? new Date((enrollment as any).createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                  })
                : "";
            lastPurchaseByUser.set(uid, `${course?.title || "Unknown"} · ${date}`);
        }

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const usersData: UserSummaryDto[] = users.map((user) => {
            const uid = user._id.toString();
            return {
                id: uid,
                name: user.name,
                email: user.email,
                studentId: user.studentId || "—",
                joinedDate: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                      })
                    : "—",
                lastLogin: user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                      })
                    : "—",
                status: user.status || "active",
                coursesCount: countByCourse.get(uid) || 0,
                lastPurchase: lastPurchaseByUser.get(uid) || "None",
            };
        });

        return {
            users: usersData,
            total: usersData.length,
            active: usersData.filter((u) => u.status === "active").length,
            blocked: usersData.filter((u) => u.status === "blocked").length,
            newUsersCount: users.filter(
                (u) => u.createdAt && new Date(u.createdAt) >= monthStart,
            ).length,
        };
    }
}
