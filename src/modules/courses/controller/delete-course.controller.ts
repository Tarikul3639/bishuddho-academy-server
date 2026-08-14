import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

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

import { AdminDeleteCourseService } from '../service/admin-delete-course.service';

@ApiTags('Admin Courses')
@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class DeleteCourseController {
  constructor(
    private readonly adminDeleteCourseService: AdminDeleteCourseService,
  ) {}

  @Delete(':courseId')
  @ApiOperation({
    summary: 'Delete course',
  })
  @ApiResponse({
    status: 200,
    description: 'Course deleted successfully',
  })
  remove(
    @Param('courseId')
    courseId: string,
  ) {
    return this.adminDeleteCourseService.execute(courseId);
  }
}
