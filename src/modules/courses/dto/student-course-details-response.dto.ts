// dto/student-course-details-response.dto.ts

import { EnrollmentStatus } from "../../../database/schemas/enrollment.schema";
import {
  PaymentMethod,
  PaymentStatus,
} from "../../../database/schemas/payment.schema";

export class StudentCourseClassDto {
  title!: string;
  session!: string;
  completed!: boolean;
}

export class StudentCourseModuleDto {
  title!: string;
  classes!: StudentCourseClassDto[];
}

export class StudentCoursePaymentDto {
  method!: PaymentMethod;
  trxId?: string;
  amount!: number;
  paidAt!: Date;
  status!: PaymentStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export class StudentCourseDetailsResponseDto {
  courseId!: string;
  title!: string;
  tagline!: string;
  description!: string;
  thumbnailUrl!: string;
  instructor!: string;
  averageRating!: number;
  reviewCount!: number;
  students!: number;
  duration!: string;
  lessons!: number;
  totalSeats!: number;
  bookedSeats!: number;
  schedule!: string;
  location!: string;
  startDate!: Date;
  includes!: string[];
  currentSession!: number;
  status!: EnrollmentStatus;
  payment!: StudentCoursePaymentDto;
  modules!: StudentCourseModuleDto[];
}