// src/auth/dto/login-response.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "../../../database/schemas/user.schema";

class UserPayloadDto {
    @ApiProperty({ example: "60d0fe4f5311236168a109ca" })
    userId!: string;

    @ApiProperty({ example: "Tarikul Islam" })
    name!: string;

    @ApiProperty({ example: "tarikul@example.com" })
    email!: string;

    @ApiProperty({ example: "01712345678", required: false })
    phone?: string;

    @ApiProperty({ example: "student" })
    role!: UserRole;

    @ApiProperty({ example: "active", required: false })
    status?: string;

    @ApiProperty({ example: "https://example.com/avatar.png", required: false })
    avatarUrl?: string;

    @ApiProperty({ example: "2023-01-01" })
    createdAt!: string;
}

export class LoginResponseDto {
    @ApiProperty({ example: true })
    success!: boolean;

    @ApiProperty({ example: "Login successful" })
    message!: string;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken!: string;

    @ApiProperty({ type: UserPayloadDto })
    user!: UserPayloadDto;
}