// teacher.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TeacherDocument = HydratedDocument<Teacher>;

/* ─────────────────────────────
   SUB DOCUMENTS
───────────────────────────── */

@Schema({ _id: false })
export class EducationHistory {
    @Prop({ required: true })
    degree!: string;

    @Prop({ required: true })
    university!: string;

    @Prop()
    field?: string;

    @Prop()
    year?: number;

    @Prop()
    grade?: string;
}

export const EducationHistorySchema = SchemaFactory.createForClass(EducationHistory);

@Schema({ _id: false })
export class Publication {
    @Prop({ required: true })
    title!: string;

    @Prop()
    journal?: string;

    @Prop()
    year?: number;

    @Prop()
    url?: string;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);

@Schema({ _id: false })
export class SocialLinks {
    @Prop()
    facebook?: string;

    @Prop()
    linkedin?: string;

    @Prop()
    github?: string;

    @Prop()
    website?: string;

    @Prop()
    googleScholar?: string;

    @Prop()
    researchGate?: string;

    @Prop()
    youtube?: string;
}

export const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);

@Schema({ _id: false })
export class TeacherSeo {
    @Prop()
    metaTitle?: string;

    @Prop()
    metaDescription?: string;

    @Prop({ type: [String], default: [] })
    keywords?: string[];

    @Prop()
    canonicalUrl?: string;
}

export const TeacherSeoSchema = SchemaFactory.createForClass(TeacherSeo);

/* ─────────────────────────────
   MAIN SCHEMA
───────────────────────────── */

@Schema({ timestamps: true })
export class Teacher {

    // ─── BASIC INFORMATION ────────────────────────────────────────────

    @Prop({ required: true })
    fullName!: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    slug!: string;

    @Prop({ required: true })
    designation!: string;

    @Prop()
    department?: string;

    @Prop()
    shortBio?: string;

    @Prop()
    biography?: string;

    @Prop({ default: '' })
    profileImage!: string;

    @Prop({ default: '' })
    coverImage!: string;

    @Prop()
    email?: string;

    @Prop()
    phone?: string;

    @Prop()
    officeAddress?: string;

    @Prop()
    officeHours?: string;

    // ─── ACADEMIC INFORMATION ─────────────────────────────────────────

    @Prop()
    academicRank?: string;

    @Prop({ type: [EducationHistorySchema], default: [] })
    educationHistory!: EducationHistory[];

    @Prop({ type: [String], default: [] })
    specialization!: string[];

    @Prop({ type: [String], default: [] })
    researchInterests!: string[];

    // ─── PROFESSIONAL INFORMATION ─────────────────────────────────────

    @Prop({ default: 0 })
    yearsOfExperience!: number;

    @Prop({ type: [String], default: [] })
    achievements!: string[];

    @Prop({ type: [String], default: [] })
    awards!: string[];

    @Prop({ type: [String], default: [] })
    certifications!: string[];

    @Prop({ type: [PublicationSchema], default: [] })
    publications!: Publication[];

    @Prop({ type: [String], default: [] })
    memberships!: string[];

    // ─── TEACHING INFORMATION ─────────────────────────────────────────

    @Prop({ type: [String], default: [] })
    currentCourses!: string[];

    @Prop({ type: [String], default: [] })
    previousCourses!: string[];

    @Prop({ type: [String], default: [] })
    expertise!: string[];

    @Prop({ default: 0 })
    instructorPriority!: number;

    // ─── SOCIAL LINKS ─────────────────────────────────────────────────

    @Prop({ type: SocialLinksSchema, default: () => ({}) })
    socialLinks!: SocialLinks;

    // ─── DISPLAY SETTINGS ─────────────────────────────────────────────

    @Prop({ default: false })
    featured!: boolean;

    @Prop({ default: true })
    isActive!: boolean;

    @Prop({ default: 0 })
    displayOrder!: number;

    @Prop({ default: false })
    isFounder!: boolean;

    @Prop({ default: false })
    isLeadInstructor!: boolean;

    @Prop({ default: false })
    showOnHomepage!: boolean;

    @Prop({ default: true })
    showContact!: boolean;

    @Prop({ default: true })
    showSocialLinks!: boolean;

    // ─── SEO ──────────────────────────────────────────────────────────

    @Prop({ type: TeacherSeoSchema, default: () => ({}) })
    seo!: TeacherSeo;

    // ─── TIMESTAMPS (auto by mongoose) ────────────────────────────────

    createdAt!: Date;
    updatedAt!: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

// Indexes for performance
TeacherSchema.index({ isActive: 1 });
TeacherSchema.index({ featured: 1 });
TeacherSchema.index({ displayOrder: 1 });
TeacherSchema.index({ isFounder: 1 });
TeacherSchema.index({ isLeadInstructor: 1 });
