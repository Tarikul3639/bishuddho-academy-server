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

import { AdminFindCourseDetailsService } from '../service/admin-find-courses-details.service';

import { AdminFindCourseDetailsResponseDto } from '../dto/admin-find-course-details-response.dto';

@ApiTags('Admin Courses')
@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class GetCourseDetailsController {
  constructor(
    private readonly adminFindCourseDetailsService: AdminFindCourseDetailsService,
  ) {}

  @Get(':courseId')
  @ApiOperation({
    summary: 'Get course details for admin',
  })
  @ApiResponse({
    status: 200,
    type: AdminFindCourseDetailsResponseDto,
  })
  findOne(
    @Param('courseId')
    courseId: string,
  ): Promise<AdminFindCourseDetailsResponseDto> {
    return this.adminFindCourseDetailsService.findById(courseId);
  }
}
