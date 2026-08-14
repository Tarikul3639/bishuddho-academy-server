import { ApiProperty } from '@nestjs/swagger';

export class DashboardCourseDto {
  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  instructor!: string;

  @ApiProperty()
  schedule!: string;

  @ApiProperty()
  location!: string;

  @ApiProperty()
  duration!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  totalSeats!: number;

  @ApiProperty()
  bookedSeats!: number;

  @ApiProperty()
  lessons!: number;

  @ApiProperty()
  revenue!: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  startDate!: Date;
}

export class DashboardCoursesResponseDto {
  @ApiProperty({
    type: [DashboardCourseDto],
  })
  courses!: DashboardCourseDto[];
}
