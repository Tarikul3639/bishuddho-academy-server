import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResetPasswordResponseDto } from '../dto/reset-password.response.dto';

import { ResetPasswordService } from '../services/reset-password.service';

@ApiTags('Authentication')
@Controller('auth')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset user password',
  })
  @ApiBody({
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    type: ResetPasswordResponseDto,
  })
  async resetPassword(
    @Body()
    dto: ResetPasswordDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.resetPasswordService.execute(dto);
  }
}
