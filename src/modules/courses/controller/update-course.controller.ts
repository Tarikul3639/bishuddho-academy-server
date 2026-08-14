import {
  Body,
  Controller,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

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

import { AdminUpdateCourseDto } from '../dto/admin-update-course.dto';

import { AdminUpdateCourseService } from '../service/admin-update-course.service';

@ApiTags('Admin Courses')
@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class UpdateCourseController {
  constructor(
    private readonly adminUpdateCourseService: AdminUpdateCourseService,
  ) {}

  @Patch(':courseId')
  @ApiOperation({
    summary: 'Update course',
  })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
  })
  @UseInterceptors(FileInterceptor('thumbnailFile'))
  update(
    @Param('courseId')
    courseId: string,

    @UploadedFile()
    thumbnailFile: Express.Multer.File,

    @Body()
    dto: AdminUpdateCourseDto,
  ) {
    return this.adminUpdateCourseService.update(courseId, thumbnailFile, dto);
  }
}
