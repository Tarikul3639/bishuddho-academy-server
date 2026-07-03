// teacher.controller.ts

import {
    Controller,
    Get,
    Param,
    Body,
    Patch,
    Delete,
    Query,
} from '@nestjs/common';

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
} from '@nestjs/swagger';

import { DeleteTeacherService } from '../services/delete-teacher.service';
import { GetTeachersService } from '../services/get-teachers.service';
import { GetTeacherDetailsService } from '../services/get-teacher-details.service';
import { ReorderTeachersService } from '../services/reorder-teachers.service';
import { FeatureTeacherService } from '../services/feature-teacher.service';
import { ChangeStatusService } from '../services/change-status.service';

import { GetTeachersDto } from '../dto/get-teachers.dto';
import { ReorderTeachersDto } from '../dto/reorder-teachers.dto';
import { FeatureTeacherDto } from '../dto/feature-teacher.dto';
import { ChangeStatusDto } from '../dto/change-status.dto';

/* ─────────────────────────────
   ADMIN CONTROLLER
───────────────────────────── */

@ApiTags('Admin Teachers')
@Controller('admin/teachers')
export class AdminTeacherController {
    constructor(
        private readonly deleteTeacherService: DeleteTeacherService,
        private readonly getTeachersService: GetTeachersService,
        private readonly getTeacherDetailsService: GetTeacherDetailsService,
        private readonly reorderTeachersService: ReorderTeachersService,
        private readonly featureTeacherService: FeatureTeacherService,
        private readonly changeStatusService: ChangeStatusService,
    ) {}

    /* GET ALL */
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all teachers (admin)' })
    findAll(@Query() query: GetTeachersDto) {
        return this.getTeachersService.findAll(query);
    }

    /* GET ONE */

    @Get(':teacherId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get teacher details by ID (admin)' })
    findOne(@Param('teacherId') teacherId: string) {
        return this.getTeacherDetailsService.findByIdAdmin(teacherId);
    }

    /* DELETE */

    @Delete(':teacherId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete teacher' })
    remove(@Param('teacherId') teacherId: string) {
        return this.deleteTeacherService.delete(teacherId);
    }

    /* REORDER */

    @Patch('action/reorder')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Reorder teachers' })
    reorder(@Body() dto: ReorderTeachersDto) {
        return this.reorderTeachersService.reorder(dto);
    }

    /* FEATURE */

    @Patch(':teacherId/feature')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Feature / Unfeature teacher' })
    feature(
        @Param('teacherId') teacherId: string,
        @Body() dto: FeatureTeacherDto,
    ) {
        return this.featureTeacherService.feature(teacherId, dto);
    }

    /* STATUS */

    @Patch(':teacherId/status')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change teacher status' })
    changeStatus(
        @Param('teacherId') teacherId: string,
        @Body() dto: ChangeStatusDto,
    ) {
        return this.changeStatusService.changeStatus(teacherId, dto);
    }
}

/* ─────────────────────────────
   PUBLIC CONTROLLER
───────────────────────────── */

@ApiTags('Public Teachers')
@Controller('public/teachers')
export class PublicTeacherController {
    constructor(
        private readonly getTeachersService: GetTeachersService,
        private readonly getTeacherDetailsService: GetTeacherDetailsService,
    ) {}

    @Get()
    @ApiOperation({
        summary: 'Get all active teachers',
    })
    findAll(@Query() query: GetTeachersDto) {
        return this.getTeachersService.findAll({
            ...query,
            isActive: true,
        });
    }

    @Get(':slug')
    @ApiOperation({
        summary: 'Get teacher details by slug',
    })
    findOne(@Param('slug') slug: string) {
        return this.getTeacherDetailsService.findBySlug(slug);
    }
}