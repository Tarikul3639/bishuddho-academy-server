// feature-teacher.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class FeatureTeacherDto {
    @ApiProperty()
    @IsBoolean()
    featured!: boolean;
}
