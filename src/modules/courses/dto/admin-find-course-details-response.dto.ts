import { ApiProperty } from "@nestjs/swagger";
import { EnrollmentStatus } from "../../../database/schemas/enrollment.schema";
import {
    PaymentMethod,
    PaymentStatus,
} from "../../../database/schemas/payment.schema";

/* ─────────────────────────────
   CLASS
───────────────────────────── */

export class CourseClassDto {
    @ApiProperty()
    title!: string;

    @ApiProperty()
    session!: string;

    @ApiProperty({ required: false })
    completed?: boolean;
}

/* ─────────────────────────────
   MODULE
───────────────────────────── */

export class CourseModuleDto {
    @ApiProperty()
    title!: string;

    @ApiProperty({
        type: [CourseClassDto],
    })
    classes!: CourseClassDto[];
}

/* ─────────────────────────────
   USER
───────────────────────────── */

export class StudentUserDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    email!: string;
}

/* ─────────────────────────────
   ENROLLMENT
───────────────────────────── */

export class StudentEnrollmentDto {
    @ApiProperty()
    enrollmentId!: string;

    @ApiProperty()
    currentSession!: number;

    @ApiProperty({
        enum: EnrollmentStatus,
    })
    status!: EnrollmentStatus;
}

/* ─────────────────────────────
   PAYMENT
───────────────────────────── */

export class StudentPaymentDto {
    @ApiProperty()
    paymentId!: string;

    @ApiProperty({
        enum: PaymentMethod,
    })
    method!: PaymentMethod;

    @ApiProperty({
        required: false,
    })
    trxId?: string;

    @ApiProperty()
    amount!: number;

    @ApiProperty()
    paidAt!: string;

    @ApiProperty({
        enum: PaymentStatus,
    })
    status!: PaymentStatus;

    @ApiProperty({
        required: false,
    })
    verifiedBy?: string;

    @ApiProperty({
        required: false,
    })
    verifiedAt?: string;

    @ApiProperty({
        required: false,
    })
    rejectionReason?: string;
}

/* ─────────────────────────────
   STUDENT
───────────────────────────── */

export class StudentDto {
    @ApiProperty({
        type: StudentUserDto,
    })
    user!: StudentUserDto;

    @ApiProperty({
        type: StudentEnrollmentDto,
    })
    enrollment!: StudentEnrollmentDto;

    @ApiProperty({
        type: StudentPaymentDto,
        required: false,
    })
    payment?: StudentPaymentDto;
}

/* ─────────────────────────────
   COURSE RESPONSE
───────────────────────────── */

export class AdminFindCourseDetailsResponseDto {
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
    schedule!: string;

    @ApiProperty()
    location!: string;

    @ApiProperty()
    startDate!: string;

    @ApiProperty()
    duration!: string;

    @ApiProperty()
    totalSeats!: number;

    @ApiProperty()
    bookedSeats!: number;

    @ApiProperty()
    price!: number;

    @ApiProperty()
    originalPrice!: number;

    @ApiProperty({
        nullable: true,
    })
    discountStarts!: string | null;

    @ApiProperty({
        nullable: true,
    })
    discountEnds!: string | null;

    @ApiProperty({
        enum: ["active", "upcoming", "completed"],
    })
    status!: "active" | "upcoming" | "completed";

    @ApiProperty()
    revenue!: number;

    @ApiProperty()
    lessons!: number;

    @ApiProperty({
        type: [String],
    })
    includes!: string[];

    @ApiProperty({
        type: [CourseModuleDto],
    })
    modules!: CourseModuleDto[];

    @ApiProperty({
        type: [StudentDto],
    })
    students!: StudentDto[];
}