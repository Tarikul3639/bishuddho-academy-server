// delete-teacher.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteTeacherDto {
    @ApiProperty({ description: 'Teacher ID' })
    @IsString()
    teacherId!: string;
}
