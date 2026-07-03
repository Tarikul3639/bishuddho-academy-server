import {
    BadRequestException,
    Injectable,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";

import * as bcrypt from "bcrypt";

import {
    User,
    UserRole,
    UserStatus,
} from "../../../database/schemas/user.schema";

import { SignupDto } from "../dto/signup.dto";
import { SignupResponseDto } from "../dto/signup.response.dto";

import { EmailService } from "../../../common/email/services/email.service";
import { EmailSubjects } from "../../../common/email/constants/email-subjects";
import { welcomeTemplate } from "../../../common/email/templates/welcome.template";

@Injectable()
export class SignupService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly emailService: EmailService,
        private readonly configService: ConfigService,
    ) { }

    async execute(
        dto: SignupDto,
    ): Promise<SignupResponseDto> {
        const email =
            dto.email
                .trim()
                .toLowerCase();

        const existingEmail =
            await this.userModel.findOne({
                email,
            });

        if (existingEmail) {
            throw new BadRequestException(
                "An account with this email already exists.",
            );
        }

        const existingPhone =
            await this.userModel.findOne({
                phone: dto.phone,
            });

        if (existingPhone) {
            throw new BadRequestException(
                "This phone number is already in use.",
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                dto.password,
                10,
            );

        const user = await this.userModel.create({
            name: dto.name.trim(),
            email,
            phone: dto.phone,
            password: hashedPassword,
            role: UserRole.STUDENT,

            status:
                UserStatus.ACTIVE,
        });

        const html = welcomeTemplate({
            name: user.name,
            loginUrl: `${this.configService.get<string>("FRONTEND_URL")}/login`,
        });

        try {
            await this.emailService.send({
                to: user.email,
                subject: EmailSubjects.WELCOME,
                html,
            });
        } catch (error) {
            console.error(
                "Failed to send welcome email:",
                error,
            );
        }

        return {
            success: true,
            message:
                "Account created successfully.",
        };
    }
}