import {
    Body,
    Controller,
    Get,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import type { Response } from 'express';

import ms, { type StringValue } from 'ms';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
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
}
