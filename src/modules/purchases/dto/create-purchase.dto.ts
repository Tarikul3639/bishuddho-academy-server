import { IsEnum, IsMongoId, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';
import { PaymentMethod } from '../../../database/schemas/enrollment.schema';

export class CreatePurchaseDto {
    @IsMongoId()
    courseId!: string;

    @IsEnum(PaymentMethod)
    method!: PaymentMethod;

    @IsOptional()
    @IsString()
    @MinLength(6)
    @ValidateIf((o) => o.method !== PaymentMethod.CASH)
    trxId?: string;
}
