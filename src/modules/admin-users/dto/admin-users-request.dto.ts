import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../../../database/schemas/user.schema';

export class FindUsersQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ enum: [UserStatus.ACTIVE, UserStatus.BLOCKED] })
    @IsOptional()
    @IsString()
    status?: string;
}

export class BlockUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional({ enum: [UserStatus.ACTIVE, UserStatus.BLOCKED] })
    @IsOptional()
    @IsEnum([UserStatus.ACTIVE, UserStatus.BLOCKED])
    status?: UserStatus;
}

export class ToggleUserStatusDto {
    @ApiPropertyOptional({ enum: [UserStatus.ACTIVE, UserStatus.BLOCKED] })
    @IsEnum([UserStatus.ACTIVE, UserStatus.BLOCKED])
    status!: UserStatus;

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
