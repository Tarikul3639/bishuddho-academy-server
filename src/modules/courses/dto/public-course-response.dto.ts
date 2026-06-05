// dto/public-course-response.dto.ts

import { CourseStatus } from "../../../database/schemas/course.schema";

export class PublicCourseResponseDto {
    courseId!: string;

    title!: string;

    tagline!: string;

    thumbnailUrl!: string;

    instructor!: string;

    price!: number;

    originalPrice!: number;

    averageRating!: number;

    reviewCount!: number;

    status!: CourseStatus;
}