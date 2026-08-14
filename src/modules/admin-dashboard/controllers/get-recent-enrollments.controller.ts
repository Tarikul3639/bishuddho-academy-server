import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RecentEnrollmentResponseDto } from '../dto/recent-enrollment.dto';
import { GetRecentEnrollmentsService } from '../services/get-recent-enrollments.service';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
export class GetRecentEnrollmentsController {
  constructor(
    private readonly getRecentEnrollmentsService: GetRecentEnrollmentsService,
  ) {}

  @Get('recent-enrollments')
  @ApiOperation({
    summary: 'Get recent enrollments for dashboard',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent enrollments fetched successfully.',
    type: RecentEnrollmentResponseDto,
  })
  async getRecentEnrollments(): Promise<RecentEnrollmentResponseDto> {
    const enrollments = await this.getRecentEnrollmentsService.execute();

    return {
      enrollments,
    };
  }
}
