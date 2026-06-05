import { ApiProperty } from "@nestjs/swagger";

export class AdminFindAllCoursesResponseDto {
    @ApiProperty({
        example: "6874e8c3d2f6f1c2f5a12345",
        description: "Unique course ID",
    })
    courseId!: string;

    @ApiProperty({
        example: "Modern Web Development",
    })
    title!: string;

    @ApiProperty({
        example: "Tarikul Islam",
    })
    instructor!: string;

    @ApiProperty({
        example: "Mon-Wed-Fri, 8:00 PM",
    })
    schedule!: string;

    @ApiProperty({
        example: "Online",
    })
    location!: string;

    @ApiProperty({
        example: "upcoming",
        enum: ["active", "upcoming", "completed"],
    })
    status!: string;

    @ApiProperty({
        example: 100,
    })
    totalSeats!: number;

    @ApiProperty({
        example: 42,
    })
    bookedSeats!: number;

    @ApiProperty({
        example: 126000,
        description: "Total revenue generated from enrollments",
    })
    revenue!: number;

    @ApiProperty({
        example: 24,
        description: "Total number of classes/sessions in the course",
    })
    lessons!: number;
}