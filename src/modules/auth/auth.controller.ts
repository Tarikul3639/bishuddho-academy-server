import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { Response } from 'express';

import ms, { type StringValue } from 'ms';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';

import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ) { }

    /* ─────────────────────────────
         LOGIN
      ───────────────────────────── */

    @Post('login')
    @ApiOperation({
        summary: 'Log in user',
    })
    @ApiBody({
        type: LoginDto,
    })
    @ApiResponse({
        status: 200,
        type: LoginResponseDto,
    })
    async login(
        @Body()
        loginDto: LoginDto,

        @Res({
            passthrough: true,
        })
        res: Response,
    ): Promise<LoginResponseDto> {
        const result = await this.authService.login(loginDto);

        const expiresIn =
            this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '7d';

        res.cookie('access_token', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: ms(expiresIn as StringValue),
        });

        return result;
    }

    /* ─────────────────────────────
         LOGOUT
      ───────────────────────────── */

    @Post('logout')
    @ApiOperation({
        summary: 'Logout user',
    })
    logout(
        @Res({
            passthrough: true,
        })
        res: Response,
    ) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return {
            success: true,
            message: 'Logout successful',
        };
    }

    /* ─────────────────────────────
         CURRENT USER
      ───────────────────────────── */

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: 'Get current logged in user',
    })
    async me(@CurrentUser('userId') userId: string) {
        return this.authService.findUserById(userId);
    }

    /* ─────────────────────────────
         PASSWORD CHANGE
      ───────────────────────────── */

    @Patch('password')
    @UseGuards(JwtAuthGuard)
    async changePassword(
        @CurrentUser('userId')
        userId: string,

        @Body()
        body: {
            current: string;
            next: string;
        },
    ) {
        return this.authService.changePassword(userId, body.current, body.next);
    }

    /* ─────────────────────────────
         PROFILE RETRIEVAL
      ───────────────────────────── */

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ type: ProfileResponseDto })
    async getProfile(
        @CurrentUser('userId') userId: string,
    ): Promise<ProfileResponseDto> {
        return this.usersService.getProfile(userId);
    }

    /* ─────────────────────────────
         PROFILE UPDATE
      ───────────────────────────── */

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update the authenticated user profile' })
    @ApiOkResponse({ description: 'Profile updated successfully.' })
    async updateProfile(
        @CurrentUser('userId') userId: string,
        @Body() dto: UpdateProfileDto,
    ): Promise<{ message: string }> {
        await this.usersService.updateProfile(userId, dto);
        return { message: 'Profile updated successfully.' };
    }
}
