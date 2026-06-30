import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ description: 'Current password', example: 'oldPassword123' })
    @IsString()
    @MinLength(1, { message: 'Current password is required.' })
    currentPassword!: string;

    @ApiProperty({ description: 'New password (at least 8 characters)', example: 'newSecurePass456' })
    @IsString()
    @MinLength(8, { message: 'New password must be at least 8 characters long.' })
    newPassword!: string;
}
