import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// otp.schema.ts
@Schema({ timestamps: true })
export class Otp {
    @Prop({ required: true })
    email!: string;

    @Prop({ required: true })
    code!: string;   // hashed

    @Prop({ enum: ["password_reset", "email_verify"] })
    type!: string;

    @Prop({ required: true })
    expiresAt!: Date;

    @Prop({ default: false })
    used!: boolean;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);