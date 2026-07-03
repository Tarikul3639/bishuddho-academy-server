// create-teacher.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/* ─────────────────────────────
   SUB DTOs
───────────────────────────── */

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
}

/* ─────────────────────────────
   MAIN DTO
───────────────────────────── */

export class CreateTeacherDto {
    /* ───────── BASIC INFORMATION ───────── */

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
    shortBio?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    biography?: string;

    /* ───────── CONTACT ───────── */

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    /* ───────── PROFESSIONAL ───────── */

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    yearsOfExperience?: number;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills?: string[];

    /* ───────── SOCIAL LINKS ───────── */

    @ApiPropertyOptional({ type: SocialLinksDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;

    /* ───────── DISPLAY SETTINGS ───────── */

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Min(0)
    displayOrder?: number;
}
