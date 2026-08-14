import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DashboardStatsResponseDto } from '../dto/dashboard-stats.dto';

import { GetDashboardStatsService } from '../services/get-dashboard-stats.service';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
export class GetDashboardStatsController {
  constructor(
    private readonly getDashboardStatsService: GetDashboardStatsService,
  ) {}

  @Get('stats')
  @ApiOperation({
    summary: 'Get dashboard statistics',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics fetched successfully.',
    type: DashboardStatsResponseDto,
  })
  async getStats(): Promise<DashboardStatsResponseDto> {
    const stats = await this.getDashboardStatsService.execute();

    return {
      stats,
    };
  }
}
