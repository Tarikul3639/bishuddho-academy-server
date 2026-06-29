import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AdminRejectPaymentDto {
    @ApiProperty({
        example: "Invalid transaction ID",
        description: "Reason for rejecting the payment",
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    reason!: string;
}