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
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { UpdateTeacherService } from '../services/update-teacher.service';

@ApiTags('Admin Teachers')
@Controller('admin/teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class UpdateTeacherController {
  constructor(private readonly updateTeacherService: UpdateTeacherService) {}

  @Patch(':teacherId')
  @ApiOperation({
    summary: 'Update teacher',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher updated successfully',
  })
  @UseInterceptors(FileInterceptor('profileImageFile'))
  update(
    @Param('teacherId')
    teacherId: string,

    @UploadedFile()
    profileImageFile: Express.Multer.File,

    @Body()
    dto: UpdateTeacherDto,
  ) {
    return this.updateTeacherService.update(teacherId, dto, profileImageFile);
  }
}
