import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Types } from 'mongoose';
import * as MongooseSchema from 'mongoose';

@Schema({
  timestamps: true,
})
export class Certificate {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Enrollment',
    required: true,
    unique: true,
  })
  enrollmentId!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  studentId!: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Course',
    required: true,
  })
  courseId!: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    trim: true,
  })
  certificateNo!: string;

  @Prop({
    required: true,
  })
  pdfUrl!: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  uploadedBy!: Types.ObjectId;

  @Prop({
    required: true,
  })
  cloudinaryPublicId!: string;

  @Prop({
    default: Date.now,
  })
  issuedAt!: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
