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

import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { CreateTeacherService } from '../services/create-teacher.service';

@ApiTags('Admin Teachers')
@Controller('admin/teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CreateTeacherController {
  constructor(private readonly createTeacherService: CreateTeacherService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new teacher',
  })
  @ApiResponse({
    status: 201,
    description: 'Teacher created successfully',
  })
  @UseInterceptors(FileInterceptor('profileImageFile'))
  create(
    @UploadedFile()
    profileImageFile: Express.Multer.File,

    @Body()
    dto: CreateTeacherDto,
  ) {
    return this.createTeacherService.create(dto, profileImageFile);
  }
}
