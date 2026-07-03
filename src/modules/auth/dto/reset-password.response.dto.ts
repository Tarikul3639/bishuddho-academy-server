import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordResponseDto {
    @ApiProperty({
        example: true,
    })
    success!: boolean;

    @ApiProperty({
        example:
            "Password reset successfully.",
    })
    message!: string;
}