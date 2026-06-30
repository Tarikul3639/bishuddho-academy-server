// service/toggle-user-block.service.ts

import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import {
    User,
    UserStatus,
} from "../../../database/schemas/user.schema";

@Injectable()
export class ToggleUserBlockService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}

    async toggleBlock(
        userId: string,
        status?: UserStatus,
        reason?: string,
    ): Promise<{
        success: boolean;
        message: string;
        status: UserStatus;
    }> {
        const user = await this.userModel.findById(
            new Types.ObjectId(userId),
        );

        if (!user) {
            throw new NotFoundException(
                "User not found",
            );
        }

        const newStatus =
            status ??
            (user.status === UserStatus.ACTIVE
                ? UserStatus.BLOCKED
                : UserStatus.ACTIVE);

        user.status = newStatus;

        await user.save();

        return {
            success: true,
            message:
                newStatus === UserStatus.BLOCKED
                    ? "User blocked successfully"
                    : "User unblocked successfully",
            status: newStatus,
        };
    }
}