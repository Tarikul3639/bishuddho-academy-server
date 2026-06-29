import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../../../database/schemas/enrollment.schema';

export class UpdatePurchaseStatusDto {
    @IsEnum(PaymentStatus)
    status!: PaymentStatus;

    @IsOptional()
    @IsString()
    note?: string;
}
