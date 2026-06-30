// dto/student-my-course-response.dto.ts
import { EnrollmentStatus } from "../../../database/schemas/enrollment.schema";
import { PaymentStatus } from "../../../database/schemas/payment.schema";

export class StudentMyCourseResponseDto {
    courseId!: string;
    title!: string;
    thumbnailUrl!: string;
    instructor!: string;
    status!: EnrollmentStatus;
    paymentStatus!: PaymentStatus;
    rejectionReason?: string;
    schedule!: string;
    location!: string;
    duration!: string;
    currentSession!: number;
    totalSessions!: number;
}