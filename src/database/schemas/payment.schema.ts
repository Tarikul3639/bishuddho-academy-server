import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import * as MongooseSchema from "mongoose";

export enum PaymentMethod {
    BKASH = "bkash",
    NAGAD = "nagad",
    ROCKET = "rocket",
    BANK_TRANSFER = "bank_transfer",
    CASH = "cash",
}

export enum PaymentStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    REJECTED = "rejected",
}

@Schema({
    timestamps: true,
})
export class Payment {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: "Enrollment",
        required: true,
        unique: true,
    })
    enrollmentId!: Types.ObjectId;

    @Prop({
        enum: PaymentMethod,
        required: true,
    })
    method!: PaymentMethod;

    @Prop()
    trxId?: string;

    @Prop({
        required: true,
    })
    amount!: number;

    @Prop({
        type: Date,
        required: true,
    })
    paidAt!: Date;

    @Prop({
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status!: PaymentStatus;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: "User",
    })
    verifiedBy?: Types.ObjectId;

    @Prop({
        type: Date,
    })
    verifiedAt?: Date;

    @Prop()
    rejectionReason?: string;

    @Prop({
        default: Date.now,
    })
    createdAt!: Date;

    @Prop({
        default: Date.now,
    })
    updatedAt!: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);