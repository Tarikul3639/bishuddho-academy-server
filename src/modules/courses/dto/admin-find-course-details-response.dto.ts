// dto/admin-find-course-details-response.dto.ts

import { ApiProperty } from "@nestjs/swagger";

export class CourseClassDto {
    @ApiProperty()
    title!: string;

    @ApiProperty()
    session!: string;

    @ApiProperty()
    completed?: boolean;
}


export class CourseModuleDto {
    @ApiProperty()
    title!: string;

    @ApiProperty({ type: [CourseClassDto] })
    classes!: CourseClassDto[];
}

export class StudentDto {
    @ApiProperty()
    enrollId!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    method!: "bkash" | "nagad" | "cash";

    @ApiProperty()
    trxId?: string;

    @ApiProperty()
    amount!: number;

    @ApiProperty()
    date!: string;

    @ApiProperty()
    status!: "active" | "pending" | "completed";
}

export class AdminFindCourseDetailsResponseDto {
    courseId!: string;

    title!: string;
    tagline!: string;
    description!: string;

    thumbnailUrl!: string;

    instructor!: string;
    schedule!: string;
    location!: string;

    startDate!: Date;
    duration!: string;

    totalSeats!: number;
    bookedSeats!: number;

    price!: number;
    originalPrice!: number;

    discountStarts?: Date;
    discountEnds?: Date;

    status!: string;

    revenue!: number;
    lessons!: number;

    includes!: string[];

    modules!: CourseModuleDto[];

    students!: StudentDto[];
}