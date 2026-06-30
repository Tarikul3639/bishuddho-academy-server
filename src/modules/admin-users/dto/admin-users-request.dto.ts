import { IsMongoId, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindUsersQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: ['active', 'blocked', ''] })
    @IsOptional()
    @IsString()
    status?: string;
}

export class BlockUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reason?: string;
}

export class ToggleUserStatusDto {
    @ApiPropertyOptional({ enum: ['active', 'blocked'] })
    @IsEnum(['active', 'blocked'])
    status!: 'active' | 'blocked';

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reason?: string;
}

export class ResetPasswordDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reason?: string;
}
