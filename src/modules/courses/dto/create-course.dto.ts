import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsString,
    IsNumber,
    IsArray,
    IsOptional,
    IsDateString,
    IsEnum,
    ValidateNested,
    IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

/* ─────────────────────────────
   ENUM
───────────────────────────── */
export enum CourseStatus {
    ACTIVE = "active",
    UPCOMING = "upcoming",
    COMPLETED = "completed",
}

/* ─────────────────────────────
   CLASS DTO
───────────────────────────── */
export class CreateCourseClassDto {
    @ApiProperty()
    @IsString()
    title!: string;

    @ApiProperty()
    @IsString()
    session!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}

/* ─────────────────────────────
   MODULE DTO
───────────────────────────── */
export class CreateCourseModuleDto {
    @ApiProperty()
    @IsString()
    title!: string;

    @ApiProperty({ type: [CreateCourseClassDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCourseClassDto)
    classes!: CreateCourseClassDto[];
}

/* ─────────────────────────────
   MAIN CREATE DTO (UPDATED)
───────────────────────────── */
export class CreateCourseDto {
    @ApiProperty({ description: "The title of the course" })
    @IsString()
    title!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    tagline?: string;

    @ApiProperty({ description: "Detailed description of course" })
    @IsString()
    description!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @ApiProperty({ description: "Instructor name" })
    @IsString()
    instructor!: string;

    /* ── Schedule should stay simple string (or later convert to object) ── */
    @ApiProperty({ description: "Class schedule (e.g. Mon-Wed-Fri 7PM)" })
    @IsString()
    schedule!: string;

    @ApiProperty({ description: "Class location / online info" })
    @IsString()
    location!: string;

    @ApiProperty({ example: "2026-07-01" })
    @IsDateString()
    startDate!: Date;

    @ApiProperty({ example: "3 Months" })
    @IsString()
    duration!: string;

    @ApiProperty()
    @IsNumber()
    totalSeats!: number;

    /* ── Pricing (ONLY source of truth) ── */
    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    price!: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    originalPrice!: number;

    /* ── Discount schedule (NO discount % stored) ── */
    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    discountStarts?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    discountEnds?: Date;

    /* ── Status ── */
    @ApiPropertyOptional({
        enum: CourseStatus,
        default: CourseStatus.UPCOMING,
    })
    @IsOptional()
    @IsEnum(CourseStatus)
    status?: CourseStatus;

    /* ── Features ── */
    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    includes?: string[];

    /* ── Curriculum ── */
    @ApiPropertyOptional({ type: [CreateCourseModuleDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCourseModuleDto)
    modules?: CreateCourseModuleDto[];
}