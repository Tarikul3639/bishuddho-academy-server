import { ApiProperty } from '@nestjs/swagger';

export class StudentCertificateDto {
  @ApiProperty()
  certificateId!: string;

  @ApiProperty()
  certificateNo!: string;

  @ApiProperty()
  pdfUrl!: string;

  @ApiProperty()
  issuedAt!: Date;
}

export class CourseCertificateStudentDto {
  @ApiProperty()
  enrollmentId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  studentName!: string;

  @ApiProperty()
  studentEmail!: string;

  @ApiProperty({
    type: StudentCertificateDto,
    required: false,
    nullable: true,
  })
  certificate!: StudentCertificateDto | null;
}

export class CourseCertificateStudentsResponseDto {
  @ApiProperty({
    type: [CourseCertificateStudentDto],
  })
  students!: CourseCertificateStudentDto[];
}
