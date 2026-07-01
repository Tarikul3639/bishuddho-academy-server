// get-teachers.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTeachersDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    department?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    expertise?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    featured?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isFounder?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isLeadInstructor?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    showOnHomepage?: boolean;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number;
}
