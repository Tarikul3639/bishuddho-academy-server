import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from "@nestjs/common";

import {
    ApiBody,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { ForgotPasswordResponseDto } from "../dto/forgot-password.response.dto";

import { ForgotPasswordService } from "../services/forgot-password.service";

@ApiTags("Authentication")
@Controller("auth")
export class ForgotPasswordController {
    constructor(
        private readonly forgotPasswordService: ForgotPasswordService,
    ) {}

    @Post("forgot-password")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary:
            "Send password reset email",
    })
    @ApiBody({
        type: ForgotPasswordDto,
    })
    @ApiResponse({
        status: 200,
        type: ForgotPasswordResponseDto,
    })
    async forgotPassword(
        @Body()
        dto: ForgotPasswordDto,
    ): Promise<ForgotPasswordResponseDto> {
        return this.forgotPasswordService.execute(
            dto,
        );
    }
}