import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import * as MongooseSchema from 'mongoose';

// enrollment.schema.ts
@Schema({ timestamps: true })
export class PaymentSummary {
    @Prop({ enum: ["bkash", "nagad", "cash"], required: true })
    method!: string;

    @Prop()
    trxId?: string;

    @Prop({ required: true })
    amount!: number;

    @Prop({ required: true })
    paidAt!: string;

    @Prop({ enum: ["pending", "verified", "rejected"], default: "pending" })
    status!: string;
}

@Schema({ timestamps: true })
export class Enrollment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
    userId!: Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Course", required: true })
    courseId!: Types.ObjectId;

    @Prop({ default: 0 })
    currentSession!: number;

    @Prop({ enum: ["active", "pending", "completed"], default: "pending" })
    status!: string;

    @Prop({ type: PaymentSummary, required: true })
    paymentSummary!: PaymentSummary;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);