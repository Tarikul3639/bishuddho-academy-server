import {
  Body,
  Controller,
  Post,
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

import { AdminCreateCourseDto } from '../dto/admin-create-course.dto';

import { AdminCreateCourseService } from '../service/admin-courses-create.service';

@ApiTags('Admin Courses')
@Controller('admin/courses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CreateCourseController {
  constructor(
    private readonly adminCreateCourseService: AdminCreateCourseService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new course',
  })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
  })
  @UseInterceptors(FileInterceptor('thumbnailFile'))
  create(
    @UploadedFile()
    thumbnailFile: Express.Multer.File,

    @Body()
    dto: AdminCreateCourseDto,
  ) {
    return this.adminCreateCourseService.create(dto, thumbnailFile);
  }
}
