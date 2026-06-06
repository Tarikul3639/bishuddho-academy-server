// src/auth/dto/login-response.dto.ts

import { ApiProperty } from "@nestjs/swagger";

class UserPayloadDto {
    @ApiProperty({ example: "60d0fe4f5311236168a109ca" })
    userId!: string;

    @ApiProperty({ example: "Tarikul Islam" })
    name!: string;

    @ApiProperty({ example: "tarikul@example.com" })
    email!: string;

    @ApiProperty({ example: "student" })
    role!: string;

    @ApiProperty({ example: "https://example.com/avatar.png", required: false })
    avatar?: string;

    @ApiProperty({ example: "BA-2026-0001", required: false })
    studentId?: string;
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