// service/toggle-user-block.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { User } from "../../../database/schemas/user.schema";

@Injectable()
export class ToggleUserBlockService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}

    async toggleBlock(
        id: string,
        status?: string,
        reason?: string,
    ): Promise<{ success: boolean; message: string; status: string }> {
        const user = await this.userModel.findById(new Types.ObjectId(id)).exec();

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const newStatus = status || (user.status === "active" ? "blocked" : "active");
        user.status = newStatus;

        await user.save();

        return {
            success: true,
            message: `User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`,
            status: newStatus,
        };
    }
}
