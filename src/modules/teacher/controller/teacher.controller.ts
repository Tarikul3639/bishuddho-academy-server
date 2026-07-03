// teacher.controller.ts

import { diskStorage } from 'multer';
import { extname, join } from 'path';

import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Patch,
    Delete,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';

import { CreateTeacherService } from '../services/create-teacher.service';
import { UpdateTeacherService } from '../services/update-teacher.service';
import { DeleteTeacherService } from '../services/delete-teacher.service';
import { GetTeachersService } from '../services/get-teachers.service';
import { GetTeacherDetailsService } from '../services/get-teacher-details.service';
import { ReorderTeachersService } from '../services/reorder-teachers.service';
import { FeatureTeacherService } from '../services/feature-teacher.service';
import { ChangeStatusService } from '../services/change-status.service';

import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { GetTeachersDto } from '../dto/get-teachers.dto';
import { ReorderTeachersDto } from '../dto/reorder-teachers.dto';
import { FeatureTeacherDto } from '../dto/feature-teacher.dto';
import { ChangeStatusDto } from '../dto/change-status.dto';

/* ─────────────────────────────
   MULTER
───────────────────────────── */

const teacherImageInterceptor = FileFieldsInterceptor(
    [{ name: 'profileImageFile', maxCount: 1 }],
    {
        storage: diskStorage({
            destination: (_req, _file, cb) => {
                cb(
                    null,
                    join(
                        process.cwd(),
                        'public',
                        'uploads',
                        'teachers',
                        'profiles',
                    ),
                );
            },
            filename: (_req, file, cb) => {
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `${unique}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (_req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Only image files are allowed'), false);
            }

            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    },
);

/* ─────────────────────────────
   ADMIN CONTROLLER
───────────────────────────── */

@ApiTags('Admin Teachers')
@Controller('admin/teachers')
export class AdminTeacherController {
    constructor(
        private readonly createTeacherService: CreateTeacherService,
        private readonly updateTeacherService: UpdateTeacherService,
        private readonly deleteTeacherService: DeleteTeacherService,
        private readonly getTeachersService: GetTeachersService,
        private readonly getTeacherDetailsService: GetTeacherDetailsService,
        private readonly reorderTeachersService: ReorderTeachersService,
        private readonly featureTeacherService: FeatureTeacherService,
        private readonly changeStatusService: ChangeStatusService,
    ) {}

    /* CREATE */

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new teacher' })
    @ApiResponse({
        status: 201,
        description: 'Teacher created successfully',
    })
    @UseInterceptors(teacherImageInterceptor)
    create(
        @UploadedFiles()
        files: {
            profileImageFile?: Express.Multer.File[];
        },
        @Body('teacherData') teacherData: string,
    ) {
        const dto: CreateTeacherDto = JSON.parse(teacherData);

        return this.createTeacherService.create(
            dto,
            files?.profileImageFile?.[0],
        );
    }

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

    /* UPDATE */

    @Patch(':teacherId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update teacher' })
    @UseInterceptors(teacherImageInterceptor)
    update(
        @Param('teacherId') teacherId: string,
        @UploadedFiles()
        files: {
            profileImageFile?: Express.Multer.File[];
        },
        @Body('teacherData') teacherData: string,
    ) {
        const dto: UpdateTeacherDto = JSON.parse(teacherData);

        return this.updateTeacherService.update(
            teacherId,
            dto,
            files?.profileImageFile?.[0],
        );
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