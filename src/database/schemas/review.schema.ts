// database/schemas/review.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { User } from './user.schema';
import { Course } from './course.schema';

@Schema({
    timestamps: true,
})
export class Review {
    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true,
        index: true,
    })
    userId!: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: Course.name,
        required: true,
        index: true,
    })
    courseId!: Types.ObjectId;

    @Prop({
        required: true,
        min: 1,
        max: 5,
    })
    rating!: number;

    @Prop({
        trim: true,
        maxlength: 1000,
        default: '',
    })
    comment!: string;

    @Prop({
        default: true,
    })
    isPublished!: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index(
    {
        userId: 1,
        courseId: 1,
    },
    {
        unique: true,
    },
);
