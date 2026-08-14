import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { plainToInstance, Transform, Type } from 'class-transformer';

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

/* ─────────────────────────────
   SUB DTO
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
  /* BASIC */

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

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  profileImagePublicId?: string;

  /* CONTACT */

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  /* PROFESSIONAL */

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number;

  @ApiPropertyOptional({
    type: [String],
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      return value;
    }

    return JSON.parse(value);
  })
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  /* SOCIAL */
  @ApiPropertyOptional({
    type: SocialLinksDto,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) {
      return undefined;
    }

    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return plainToInstance(SocialLinksDto, parsed);
  })
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  /* DISPLAY */
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  displayOrder?: number;
}
