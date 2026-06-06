// dto/student-course-details-response.dto.ts

import { EnrollmentStatus, PaymentStatus, PaymentMethod } from "../../../database/schemas/enrollment.schema";

export class StudentCourseClassDto {
    title!: string;
    session!: string;
    completed!: boolean;
}

export class StudentCourseModuleDto {
    title!: string;
    classes!: StudentCourseClassDto[];
}

export class StudentCoursePaymentSummaryDto {
    method!: PaymentMethod;
    trxId?: string;
    amount!: number;
    paidAt!: string;
    status!: PaymentStatus;
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
    paymentSummary!: StudentCoursePaymentSummaryDto;
    modules!: StudentCourseModuleDto[];
}