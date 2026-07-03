// get-teacher-details.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTeacherDetailsDto {
    @ApiProperty({ description: 'Teacher slug' })
    @IsString()
    slug!: string;
}
