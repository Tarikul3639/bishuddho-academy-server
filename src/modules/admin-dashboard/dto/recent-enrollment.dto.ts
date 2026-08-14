// dto/recent-enrollment.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class RecentEnrollmentDto {
  @ApiProperty()
  enrollmentId!: string;

  @ApiProperty()
  studentName!: string;

  @ApiProperty()
  courseName!: string;

  @ApiProperty({
    example: 'bkash',
  })
  method!: string;

  @ApiProperty({
    example: 'pending',
  })
  status!: string;

  @ApiProperty({
    example: '2026-07-02T10:30:00.000Z',
  })
  date!: Date;
}

export class RecentEnrollmentResponseDto {
  @ApiProperty({
    type: [RecentEnrollmentDto],
  })
  enrollments!: RecentEnrollmentDto[];
}
