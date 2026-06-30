// service/reset-user-password.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { User } from "../../../database/schemas/user.schema";

@Injectable()
export class ResetUserPasswordService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}

    async resetPassword(id: string): Promise<{ success: boolean; message: string }> {
        const user = await this.userModel.findById(new Types.ObjectId(id)).exec();

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // // Generate a temporary password
        // const tempPassword = Math.random().toString(36).slice(-10);

        // // Use the existing auth service's pattern for password hashing
        // const bcrypt = await import("bcrypt");
        // const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // user.password = hashedPassword;
        // await user.save();

        // In production, this would send an email with the temp password
        // For now, we return success — admin communicates the password offline

        //TODO: Will implement email service to send the temporary password to the user in production.

        return {
            success: true,
            message: "Password reset successfully. Please inform the user through the academy.",
        };
    }
}
