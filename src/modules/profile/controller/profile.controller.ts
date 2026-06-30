import {
    Controller,
    Get,
    Patch,
    Body,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

import { GetProfileService } from '../services/get-profile.service';
import { UpdateProfileService } from '../services/update-profile.service';
import { ChangePasswordService } from '../services/change-password.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly getProfileService: GetProfileService,
        private readonly updateProfileService: UpdateProfileService,
        private readonly changePasswordService: ChangePasswordService,
    ) { }

    /* ─── Get Current Profile ─────────────────────────────────── */
    @Get()
    @ApiOperation({ summary: 'Get the currently authenticated user profile' })
    @ApiResponse({ status: 200, description: 'Profile data', type: ProfileResponseDto })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Account suspended' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getProfile(
        @CurrentUser('userId') userId: string,
    ): Promise<ProfileResponseDto> {
        return this.getProfileService.execute(userId);
    }

    /* ─── Update Profile ──────────────────────────────────────── */
    @Patch()
    @ApiOperation({ summary: 'Update the currently authenticated user profile' })
    @ApiResponse({ status: 200, description: 'Updated profile data', type: ProfileResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Account suspended' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateProfile(
        @CurrentUser('userId') userId: string,
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<ProfileResponseDto> {
        return this.updateProfileService.execute(userId, updateProfileDto);
    }

    /* ─── Change Password ─────────────────────────────────────── */
    @Patch('password')
    @ApiOperation({ summary: 'Change the currently authenticated user password' })
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    @ApiResponse({ status: 401, description: 'Unauthorized or incorrect current password' })
    @ApiResponse({ status: 403, description: 'Account suspended' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async changePassword(
        @CurrentUser('userId') userId: string,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<{ success: boolean; message: string }> {
        return this.changePasswordService.execute(userId, changePasswordDto);
    }
}
