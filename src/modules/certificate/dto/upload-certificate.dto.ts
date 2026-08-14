import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UploadCertificateDto {
  @ApiProperty({
    example: '6866d72d8d8d6a1d6b4f3a10',
  })
  @IsMongoId()
  enrollmentId!: string;

  @ApiProperty({
    example: 'BA-2026-0001',
  })
  @IsString()
  @IsNotEmpty()
  certificateNo!: string;
}
