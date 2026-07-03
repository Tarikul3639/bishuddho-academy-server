// change-status.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangeStatusDto {
    @ApiProperty()
    @IsBoolean()
    isActive!: boolean;
}
