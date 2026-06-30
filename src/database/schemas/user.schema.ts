import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
    STUDENT = 'student',
    ADMIN = 'admin',
}

// user.schema.ts
@Schema({ timestamps: true })
export class User {
    // ─── CORE ────────────────────────────────────────────────────────────────

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true, lowercase: true })
    email!: string;

    @Prop({ required: true, select: false })
    password!: string;

    @Prop({ enum: UserRole, default: UserRole.STUDENT })
    role!: UserRole;

    @Prop({ default: 'active' }) // "active" | "blocked"
    status!: string;

    @Prop()
    avatarUrl?: string;

    @Prop({ unique: true, sparse: true })
    studentId?: string; // auto-generated: BA-2026-0001

    @Prop()
    lastLogin?: Date;

    // ─── PERSONAL INFO ───────────────────────────────────────────────────────

    @Prop()
    phone?: string;

    @Prop()
    alternativePhone?: string;

    @Prop()
    dateOfBirth?: Date;

    @Prop({ enum: ['Male', 'Female', 'Other', 'Prefer not to say'] })
    gender?: string;

    @Prop({ enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] })
    bloodGroup?: string;

    @Prop({ enum: ['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'] })
    religion?: string;

    @Prop({ default: 'Bangladeshi' })
    nationality?: string;

    // ─── IDENTITY DOCUMENTS ──────────────────────────────────────────────────

    @Prop()
    nidNumber?: string;

    @Prop()
    birthRegistrationNumber?: string;

    @Prop()
    passportNumber?: string;

    // ─── ACADEMIC INFO ───────────────────────────────────────────────────────

    @Prop()
    rollNumber?: string;

    @Prop()
    registrationNumber?: string;

    @Prop()
    session?: string;

    @Prop()
    department?: string;

    @Prop()
    program?: string;

    @Prop()
    semester?: string;

    @Prop()
    batch?: string;

    @Prop()
    admissionDate?: Date;

    // ─── FAMILY & GUARDIAN ───────────────────────────────────────────────────

    @Prop()
    fatherName?: string;

    @Prop()
    motherName?: string;

    @Prop()
    guardianName?: string;

    @Prop()
    guardianPhone?: string;

    @Prop()
    guardianOccupation?: string;

    // ─── EMERGENCY CONTACT ───────────────────────────────────────────────────

    @Prop()
    emergencyContactName?: string;

    @Prop()
    emergencyContactNumber?: string;

    @Prop({ enum: ['Father', 'Mother', 'Sibling', 'Spouse', 'Friend', 'Other'] })
    relationship?: string;

    // ─── ADDRESS ─────────────────────────────────────────────────────────────

    @Prop()
    presentAddress?: string;

    @Prop()
    permanentAddress?: string;

    // ─── TIMESTAMPS (auto by mongoose) ───────────────────────────────────────

    createdAt!: Date;
    updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);