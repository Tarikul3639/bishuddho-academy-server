import {
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as crypto from "crypto";

import { User } from "../../../database/schemas/user.schema";
import { EmailService } from "../../../common/email/services/email.service";
import { EmailSubjects } from "../../../common/email/constants/email-subjects";
import { forgotPasswordTemplate } from "../../../common/email/templates/forgot-password.template";

@Injectable()
export class AdminInitiatePasswordResetService {
  private readonly logger = new Logger(AdminInitiatePasswordResetService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async resetPassword(
    id: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const user = await this.userModel.findById(new Types.ObjectId(id));

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    // Generate raw token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Save token
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 15);

    await user.save();

    const frontendUrl = this.configService.get<string>("FRONTEND_URL");
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    const html = forgotPasswordTemplate({
      name: user.name.trim(),
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
        "Failed to send admin initiated password reset email.",
        error instanceof Error ? error.stack : undefined,
      );
    }

    return {
      success: true,
      message: "Password reset email sent successfully.",
    };
  }
}