import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

import { User } from "../../database/schemas/user.schema";
import { LoginDto } from "./dto/login.dto";

import { JwtPayload } from "./interface/jwt-payload";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
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
           4. Generate JWT Token
        ───────────────────────────── */
        const payload: JwtPayload = {
            userId: user._id.toJSON(),
            email: user.email,
            role: user.role
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
                role: user.role,
                avatar: user.avatar,
                studentId: user.studentId,
            },
        };
    }

    /* ─────────────────────────────
       Find User by ID
    ───────────────────────────── */
    async findUserById(
        userId: string,
    ) {
        const user =
            await this.userModel
                .findById(userId)
                .lean();

        if (!user) {
            throw new UnauthorizedException(
                "User not found",
            );
        }

        return {
            userId:
                user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            studentId:
                user.studentId,
        };
    }
}