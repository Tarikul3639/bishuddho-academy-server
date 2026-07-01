// create-teacher.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsArray,
    ValidateNested,
    IsEmail,
    IsUrl,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/* ─── Sub DTOs ─── */
export class EducationHistoryDto {
    @ApiProperty()
    @IsString()
    degree!: string;

    @ApiProperty()
    @IsString()
    university!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    field?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    year?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    grade?: string;
}

export class PublicationDto {
    @ApiProperty()
    @IsString()
    title!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    journal?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    year?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    url?: string;
}

export class SocialLinksDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    facebook?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    linkedin?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    github?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    website?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    googleScholar?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    researchGate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    youtube?: string;
}

export class TeacherSeoDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    metaTitle?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    metaDescription?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    keywords?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    canonicalUrl?: string;
}

/* ─── Main DTO ─── */
export class CreateTeacherDto {
    // Basic
    @ApiProperty()
    @IsString()
    fullName!: string;

    @ApiProperty()
    @IsString()
    slug!: string;

    @ApiProperty()
    @IsString()
    designation!: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    department?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    shortBio?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    biography?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    officeAddress?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    officeHours?: string;

    // Academic
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    academicRank?: string;

    @ApiPropertyOptional({ type: [EducationHistoryDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EducationHistoryDto)
    educationHistory?: EducationHistoryDto[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    specialization?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    researchInterests?: string[];

    // Professional
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    yearsOfExperience?: number;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    achievements?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    awards?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    certifications?: string[];

    @ApiPropertyOptional({ type: [PublicationDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PublicationDto)
    publications?: PublicationDto[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    memberships?: string[];

    // Teaching
    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    currentCourses?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    previousCourses?: string[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    expertise?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    instructorPriority?: number;

    // Social
    @ApiPropertyOptional({ type: SocialLinksDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;

    // Display settings
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    displayOrder?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isFounder?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isLeadInstructor?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    showOnHomepage?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    showContact?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    showSocialLinks?: boolean;

    // SEO
    @ApiPropertyOptional({ type: TeacherSeoDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => TeacherSeoDto)
    seo?: TeacherSeoDto;
}
