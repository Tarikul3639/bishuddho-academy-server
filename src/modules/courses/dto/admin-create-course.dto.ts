import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { Type, Transform } from 'class-transformer';

import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/* ─────────────────────────────
    ENUM
───────────────────────────── */

export enum CourseStatus {
  ACTIVE = 'active',
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
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
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  completed?: boolean;
}

/* ─────────────────────────────
    MODULE DTO
───────────────────────────── */

export class AdminCreateCourseModuleDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty({
    type: [CreateCourseClassDto],
  })
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateCourseClassDto)
  classes!: CreateCourseClassDto[];
}

/* ─────────────────────────────
    MAIN DTO
───────────────────────────── */

export class AdminCreateCourseDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  thumbnailPublicId?: string;

  @ApiProperty()
  @IsString()
  instructor!: string;

  @ApiProperty()
  @IsString()
  schedule!: string;

  @ApiProperty()
  @IsString()
  location!: string;

  @ApiProperty()
  @IsDateString()
  startDate!: Date;

  @ApiProperty()
  @IsString()
  duration!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  totalSeats!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  originalPrice!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  discountStarts?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  discountEnds?: Date;

  @ApiPropertyOptional({
    enum: CourseStatus,
    default: CourseStatus.UPCOMING,
  })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return JSON.parse(value);
  })
  @IsArray()
  @IsString({
    each: true,
  })
  includes?: string[];

  @ApiPropertyOptional({
    type: [AdminCreateCourseModuleDto],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return JSON.parse(value);
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => AdminCreateCourseModuleDto)
  modules?: AdminCreateCourseModuleDto[];
}
