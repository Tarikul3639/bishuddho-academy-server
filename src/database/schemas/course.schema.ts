import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

/* ─────────────────────────────
   Course Class (Sub Document)
───────────────────────────── */
@Schema({ _id: true })
export class CourseClass {
    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    session!: string;

    @Prop({ default: false })
    completed?: boolean;
}

export const CourseClassSchema =
    SchemaFactory.createForClass(CourseClass);

/* ─────────────────────────────
   Course Module (Sub Document)
───────────────────────────── */
@Schema({ _id: true })
export class CourseModule {
    @Prop({ required: true })
    title!: string;

    @Prop({ type: [CourseClassSchema], default: [] })
    classes!: CourseClass[];
}

export const CourseModuleSchema =
    SchemaFactory.createForClass(CourseModule);

/* ─────────────────────────────
   MAIN COURSE SCHEMA
───────────────────────────── */
@Schema({ timestamps: true })
export class Course {
    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    tagline!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ default: "" })
    thumbnailUrl!: string;

    @Prop({ required: true })
    instructor!: string;

    @Prop({ required: true })
    startDate!: Date;

    @Prop({ required: true })
    duration!: string;

    @Prop({ required: true })
    totalSeats!: number;

    @Prop({ required: true })
    price!: number;

    @Prop({ required: true })
    originalPrice!: number;

    /* ── Discount Schedule (NO discount % stored) ── */
    @Prop()
    discountStarts?: Date;

    @Prop()
    discountEnds?: Date;

    /* ── Status ── */
    @Prop({
        enum: ["active", "upcoming", "completed"],
        default: "upcoming",
    })
    status!: string;

    /* ── Features / Includes ── */
    @Prop({ type: [String], default: [] })
    includes!: string[];

    /* ── Curriculum ── */
    @Prop({ type: [CourseModuleSchema], default: [] })
    modules!: CourseModule[];
}

export const CourseSchema =
    SchemaFactory.createForClass(Course);