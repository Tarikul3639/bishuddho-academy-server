import {
    IsEnum,
    IsMongoId,
    IsOptional,
    IsString,
    MinLength,
    ValidateIf,
} from "class-validator";

import { PaymentMethod } from "../../../database/schemas/payment.schema";

export class CreatePurchaseDto {
    @IsMongoId()
    courseId!: string;

    @IsEnum(PaymentMethod)
    method!: PaymentMethod;

    @ValidateIf((o) => o.method !== PaymentMethod.CASH)
    @IsString()
    @MinLength(6)
    trxId?: string;
}