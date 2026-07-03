// teacher.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type TeacherDocument = HydratedDocument<Teacher>;

@Schema({ _id: false })
class SocialLinks {
  @Prop()
  facebook?: string;

  @Prop()
  linkedin?: string;

  @Prop()
  github?: string;

  @Prop()
  website?: string;
}

const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);

@Schema({ timestamps: true })
export class Teacher {
  // Basic Information
  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  slug!: string;

  @Prop({ required: true })
  designation!: string;

  @Prop()
  shortBio?: string;

  @Prop()
  biography?: string;

  @Prop({ default: '' })
  profileImage!: string;

  @Prop({ default: '' })
  profileImagePublicId!: string;

  // Contact
  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  // Professional
  @Prop({ default: 0 })
  yearsOfExperience!: number;

  @Prop({ type: [String], default: [] })
  skills!: string[];

  // Social Links
  @Prop({
    type: SocialLinksSchema,
    default: () => ({}),
  })
  socialLinks!: SocialLinks;

  // Display
  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: false })
  featured!: boolean;

  @Prop({ default: 0 })
  displayOrder!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);

TeacherSchema.index({ isActive: 1 });
TeacherSchema.index({ featured: 1 });
TeacherSchema.index({ displayOrder: 1 });