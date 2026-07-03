import { ApiProperty } from "@nestjs/swagger";

export class CertificateDto {
    @ApiProperty()
    certificateId!: string;

    @ApiProperty()
    enrollmentId!: string;

    @ApiProperty()
    studentId!: string;

    @ApiProperty()
    studentName!: string;

    @ApiProperty()
    studentEmail!: string;

    @ApiProperty()
    courseId!: string;

    @ApiProperty()
    courseTitle!: string;

    @ApiProperty()
    certificateNo!: string;

    @ApiProperty()
    pdfUrl!: string;

    @ApiProperty()
    uploadedBy!: string;

    @ApiProperty()
    issuedAt!: Date;
}

export class CertificateResponseDto {
    @ApiProperty({
        type: CertificateDto,
    })
    certificate!: CertificateDto;
}

export class CertificateListResponseDto {
    @ApiProperty({
        type: [CertificateDto],
    })
    certificates!: CertificateDto[];
}