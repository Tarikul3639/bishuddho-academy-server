import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import {
    EnrollmentStatus,
} from "../../../database/schemas/enrollment.schema";

import {
    PaymentMethod,
    PaymentStatus,
} from "../../../database/schemas/payment.schema";

/* ─────────────────────────────
   CLASS
───────────────────────────── */

export class CourseModuleClassDto {
    @ApiProperty()
    title!: string;

    @ApiProperty()
    session!: string;
}

/* ─────────────────────────────
   MODULE
───────────────────────────── */

export class CourseModuleDto {
    @ApiProperty()
    title!: string;

    @ApiProperty({
        type: [CourseModuleClassDto],
    })
    classes!: CourseModuleClassDto[];
}

/* ─────────────────────────────
   PAYMENT
───────────────────────────── */

export class PublicCoursePaymentDto {
    @ApiProperty({
        enum: PaymentMethod,
    })
    method!: PaymentMethod;

    @ApiPropertyOptional()
    trxId?: string;

    @ApiProperty()
    amount!: number;

    @ApiProperty()
    paidAt!: string;

    @ApiProperty({
        enum: PaymentStatus,
    })
    status!: PaymentStatus;

    @ApiPropertyOptional()
    verifiedBy?: string;

    @ApiPropertyOptional()
    verifiedAt?: string;

    @ApiPropertyOptional()
    rejectionReason?: string;
}

/* ─────────────────────────────
   RESPONSE
───────────────────────────── */

export class PublicCourseDetailsResponseDto {
    @ApiProperty()
    courseId!: string;

    @ApiProperty()
    title!: string;

    @ApiProperty()
    tagline!: string;

    @ApiProperty()
    description!: string;

    @ApiProperty()
    thumbnailUrl!: string;

    @ApiProperty()
    instructor!: string;

    @ApiProperty()
    averageRating!: number;

    @ApiProperty()
    reviewCount!: number;

    @ApiProperty()
    students!: number;

    @ApiProperty()
    price!: number;

    @ApiProperty()
    originalPrice!: number;

    @ApiProperty()
    discount!: number;

    @ApiProperty()
    daysLeft!: number;

    @ApiProperty()
    duration!: string;

    @ApiProperty()
    lessons!: number;

    @ApiProperty()
    totalSeats!: number;

    @ApiProperty()
    bookedSeats!: number;

    @ApiProperty()
    schedule!: string;

    @ApiProperty()
    location!: string;

    @ApiProperty()
    startDate!: string;

    @ApiProperty()
    isEnrolled!: boolean;

    @ApiPropertyOptional({
        enum: EnrollmentStatus,
    })
    enrollmentStatus?: EnrollmentStatus;

    @ApiPropertyOptional({
        type: PublicCoursePaymentDto,
    })
    payment?: PublicCoursePaymentDto;

    @ApiProperty({
        type: [String],
    })
    includes!: string[];

    @ApiProperty({
        type: [CourseModuleDto],
    })
    modules!: CourseModuleDto[];
}