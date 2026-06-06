// src/auth/dto/login.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: "The registered email address of the user",
        example: "student@example.com",
    })
    @IsNotEmpty({ message: "Email is required." })
    @IsEmail({}, { message: "Please provide a valid email address." })
    email!: string;

    @ApiProperty({
        description: "The user's password (must be at least 8 characters)",
        example: "password123",
        minLength: 8,
    })
    @IsNotEmpty({ message: "Password is required." })
    @IsString()
    @MinLength(8, { message: "Password must be at least 8 characters long." })
    password!: string;
}