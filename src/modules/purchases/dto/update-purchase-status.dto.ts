import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaymentStatus } from "../../../database/schemas/payment.schema";

export class UpdatePurchaseStatusDto {
    @IsEnum(PaymentStatus)
    status!: PaymentStatus;

    @IsOptional()
    @IsString()
    rejectionReason?: string;
}