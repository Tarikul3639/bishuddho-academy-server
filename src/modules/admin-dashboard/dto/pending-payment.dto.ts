import { ApiProperty } from '@nestjs/swagger';
import {
  PaymentMethod,
  PaymentStatus,
} from '../../../database/schemas/payment.schema';

export class PendingPaymentDto {
  @ApiProperty()
  paymentId!: string;

  @ApiProperty()
  enrollmentId!: string;

  @ApiProperty()
  studentName!: string;

  @ApiProperty()
  courseName!: string;

  @ApiProperty({
    enum: PaymentMethod,
  })
  method!: PaymentMethod;

  @ApiProperty({
    enum: PaymentStatus,
    required: false,
    nullable: true,
  })
  status?: PaymentStatus;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  trxId?: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  paidAt!: Date;
}

export class PendingPaymentsResponseDto {
  @ApiProperty({
    type: [PendingPaymentDto],
  })
  payments!: PendingPaymentDto[];
}
