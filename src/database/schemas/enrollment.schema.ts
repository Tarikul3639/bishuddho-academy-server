import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import * as MongooseSchema from "mongoose";

export enum EnrollmentStatus {
    ACTIVE = "active",
    PENDING = "pending",
    COMPLETED = "completed",
}

@Schema({
    timestamps: true,
})
export class Enrollment {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: "User",
        required: true,
    })
    userId!: Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: "Course",
        required: true,
    })
    courseId!: Types.ObjectId;

    @Prop({
        enum: EnrollmentStatus,
        default: EnrollmentStatus.PENDING,
    })
    status!: EnrollmentStatus;
}

export const EnrollmentSchema =
    SchemaFactory.createForClass(Enrollment);