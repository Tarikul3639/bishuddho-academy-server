// dto/student-my-course-response.dto.ts
import { EnrollmentStatus } from "../../../database/schemas/enrollment.schema";

export class StudentMyCourseResponseDto {
    courseId!: string;
    title!: string;
    thumbnailUrl!: string;
    instructor!: string;
    status!: EnrollmentStatus;
    schedule!: string;
    location!: string;
    duration!: string;
    currentSession!: number;
    totalSessions!: number;
}