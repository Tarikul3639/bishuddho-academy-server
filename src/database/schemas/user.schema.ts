import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// user.schema.ts
@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email!: string;

    @Prop({ required: true, select: false })
    password!: string;

    @Prop({ enum: ["student", "admin"], default: "student" })
    role!: string;

    @Prop({ default: "active" })  // "active" | "blocked"
    status!: string;

    @Prop()
    avatar?: string;

    @Prop({ unique: true })
    studentId?: string;  // auto-generated: BA-2026-0001

    @Prop()
    lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);