import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SignupDto } from '../dto/signup.dto';
import { SignupResponseDto } from '../dto/signup.response.dto';

import { SignupService } from '../services/signup.service';

@ApiTags('Authentication')
@Controller('auth')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
  })
  @ApiBody({
    type: SignupDto,
  })
  @ApiResponse({
    status: 201,
    type: SignupResponseDto,
  })
  signup(
    @Body()
    dto: SignupDto,
  ): Promise<SignupResponseDto> {
    return this.signupService.execute(dto);
  }
}
