import {
    Injectable,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as crypto from "crypto";

import { User } from "../../../database/schemas/user.schema";
import { EmailService } from "../../../common/email/services/email.service";
import { EmailSubjects } from "../../../common/email/constants/email-subjects";
import { forgotPasswordTemplate } from "../../../common/email/templates/forgot-password.template";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { ForgotPasswordResponseDto } from "../dto/forgot-password.response.dto";

@Injectable()
export class ForgotPasswordService {
    private readonly logger = new Logger(ForgotPasswordService.name);

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) { }

    async execute(dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
        const email = dto.email.trim().toLowerCase();

        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new NotFoundException("No account found with this email address.");
        }

        // Generate reset token
        const rawToken = crypto.randomBytes(32).toString("hex");

        // Hash token before saving
        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 15);

        await user.save();

        const resetUrl = `${this.configService.get("FRONTEND_URL")}/reset-password?token=${rawToken}`;

        const html = forgotPasswordTemplate({
            name: user.name,
            resetUrl,
        });

        try {
            await this.emailService.send({
                to: user.email,
                subject: EmailSubjects.FORGOT_PASSWORD,
                html,
            });
        } catch (error) {
            this.logger.error(
                "Failed to send forgot password email.",
                error instanceof Error ? error.stack : undefined,
            );
        }

        return {
            success: true,
            message: "Password reset link has been sent to your email address.",
        };
    }
}