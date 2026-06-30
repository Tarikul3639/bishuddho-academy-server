import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { User, UserRole } from "../../database/schemas/user.schema";
import { Enrollment, EnrollmentStatus } from "src/database/schemas/enrollment.schema";
import { LoginDto } from "./dto/login.dto";
import { LoginResponseDto } from "./dto/login-response.dto";

import { JwtPayload } from "./interface/jwt-payload";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,

        private readonly jwtService: JwtService,

        @InjectModel(Enrollment.name)
        private readonly enrollmentModel: Model<Enrollment>,
    ) { }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = loginDto;

        /* ─────────────────────────────
           1. Find user by email
        ───────────────────────────── */
        // Explicitly select password because it is hidden by default in the schema
        const user = await this.userModel.findOne({ email }).select("+password").exec();

        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }

        /* ─────────────────────────────
           2. Check account status
        ───────────────────────────── */
        if (user.status === "blocked") {
            throw new UnauthorizedException("Your account has been suspended");
        }

        /* ─────────────────────────────
           3. Verify Password
        ───────────────────────────── */
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }

        /* ─────────────────────────────
              Count enrolled courses for students
        ───────────────────────────── */
        let enrolledCoursesCount: number | undefined = undefined;

        if (user.role === UserRole.STUDENT) {
            enrolledCoursesCount = await this.enrollmentModel.countDocuments({ userId: user._id, status: EnrollmentStatus.ACTIVE }).exec();
        }

        /* ─────────────────────────────
           4. Generate JWT Token
        ───────────────────────────── */
        const payload: JwtPayload = {
            userId: user._id.toJSON(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role as UserRole,
            status: user.status,
            enrolledCourses: enrolledCoursesCount, // Only include for students
            createdAt: user.createdAt.toDateString(),
            avatarUrl: user.avatarUrl, // Include avatar URL if available
        };

        const accessToken = this.jwtService.sign(payload);

        /* ─────────────────────────────
           5. Return formatted response
        ───────────────────────────── */
        return {
            success: true,
            message: "Login successful",
            accessToken,
            user: {
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role as UserRole,
                status: user.status,
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt.toDateString(),
            },
        };
    }

    /* ─────────────────────────────
       Find User by ID
    ───────────────────────────── */
    async findUserById(
        userId: string,
    ): Promise<JwtPayload> {
        const user =
            await this.userModel
                .findById(userId)
                .lean();

        if (!user) {
            throw new UnauthorizedException(
                "User not found",
            );
        }

        /* ─────────────────────────────
      Count enrolled courses for students
───────────────────────────── */
        let enrolledCoursesCount: number | undefined = undefined;
        if (user.role === UserRole.STUDENT) {
            enrolledCoursesCount = await this.enrollmentModel.countDocuments({ userId: user._id, status: EnrollmentStatus.ACTIVE }).exec();
        }

        return {
            userId:
                user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role as UserRole,
            avatarUrl: user.avatarUrl,
            enrolledCourses: enrolledCoursesCount,
            status: user.status,
            createdAt: user.createdAt.toDateString(),
        };
    }

    /* ─────────────────────────────
       Logout User
    ───────────────────────────── */
    async logout(): Promise<{ success: boolean; message: string }> {
        return {
            success: true,
            message:
                "Logout successful",
        };
    }
}