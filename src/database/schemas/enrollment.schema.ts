import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as MongooseSchema from 'mongoose';

export enum PaymentMethod {
    BKASH = "bkash",
    NAGAD = "nagad",
    ROCKET = "rocket",
    BANK_TRANSFER = "bank_transfer",
    CASH = "cash"
}

export enum EnrollmentStatus {
    ACTIVE = "active",
    PENDING = "pending",
    COMPLETED = "completed"
}

export enum PaymentStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected"
}

// enrollment.schema.ts
@Schema({ timestamps: true })
export class PaymentSummary {
    @Prop({ enum: PaymentMethod, required: true })
    method!: PaymentMethod;

    @Prop()
    trxId?: string;

    @Prop({ required: true })
    amount!: number;

    @Prop({ required: true })
    paidAt!: string;

    @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
    status!: PaymentStatus;
}

@Schema({ timestamps: true })
export class Enrollment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
    userId!: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true })
    courseId!: Types.ObjectId;

    @Prop({ default: 0 })
    currentSession!: number;

    @Prop({ enum: EnrollmentStatus, default: EnrollmentStatus.PENDING })
    status!: EnrollmentStatus;

    @Prop({ type: PaymentSummary, required: true })
    paymentSummary!: PaymentSummary;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);