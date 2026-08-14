import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

import { UserRole } from '../../../database/schemas/user.schema';

import { GetCourseCertificatesService } from '../services/get-course-certificates.service';

import { CourseCertificateStudentsResponseDto } from '../dto/course-certificate-student.dto';

@ApiTags('Admin Certificates')
@Controller('admin/certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class GetCourseCertificatesController {
  constructor(
    private readonly getCourseCertificatesService: GetCourseCertificatesService,
  ) {}

  @Get('course/:courseId')
  @ApiOperation({
    summary: 'Get all certificate information for a course',
  })
  @ApiResponse({
    status: 200,
    type: CourseCertificateStudentsResponseDto,
  })
  findByCourse(
    @Param('courseId')
    courseId: string,
  ): Promise<CourseCertificateStudentsResponseDto> {
    return this.getCourseCertificatesService.execute(courseId);
  }
}
