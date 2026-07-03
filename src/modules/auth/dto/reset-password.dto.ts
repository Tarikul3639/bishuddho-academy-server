import {
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty({
        example:
            "2d9d0a5d5d8d7c0d7f1f7c9f5d4c8b8d8d6e7f9a4c2b1e0f9d8c7b6a5e4d3c2",
    })
    @IsString()
    @IsNotEmpty()
    token!: string;

    @ApiProperty({
        example: "NewPassword123@",
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
    )
    password!: string;

    @ApiProperty({
        example: "NewPassword123@",
    })
    @IsString()
    @IsNotEmpty()
    confirmPassword!: string;
}