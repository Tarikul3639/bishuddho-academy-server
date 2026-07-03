import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
    @ApiProperty({
        example: "Tarikul Islam",
    })
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        example: "tarikul@example.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({
        example: "01712345678",
    })
    @IsString()
    @Matches(/^01[3-9]\d{8}$/, {
        message:
            "Please provide a valid Bangladeshi phone number.",
    })
    phone!: string;

    @ApiProperty({
        example: "Password123@",
    })
    @IsString()
    @MinLength(8)
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        {
            message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
    )
    password!: string;
}