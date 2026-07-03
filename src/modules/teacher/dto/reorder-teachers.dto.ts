// reorder-teachers.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderItemDto {
    @ApiProperty()
    @IsString()
    teacherId!: string;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    displayOrder!: number;
}

export class ReorderTeachersDto {
    @ApiProperty({ type: [ReorderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReorderItemDto)
    items!: ReorderItemDto[];
}
