import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({
    example: 128,
  })
  totalStudents!: number;

  @ApiProperty({
    example: 448000,
  })
  totalRevenue!: number;

  @ApiProperty({
    example: 6,
  })
  activeCourses!: number;

  @ApiProperty({
    example: 2,
  })
  upcomingCourses!: number;

  @ApiProperty({
    example: 14,
  })
  pendingPayments!: number;

  @ApiProperty({
    example: 12,
  })
  newStudentsThisMonth!: number;

  @ApiProperty({
    example: 28000,
  })
  revenueThisMonth!: number;
}

export class DashboardStatsResponseDto {
  @ApiProperty({
    type: DashboardStatsDto,
  })
  stats!: DashboardStatsDto;
}
