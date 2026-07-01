// teacher.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Teacher, TeacherSchema } from '../../database/schemas/teacher.schema';

import { AdminTeacherController } from './controller/teacher.controller';
import { PublicTeacherController } from './controller/teacher.controller';

import { CreateTeacherService } from './services/create-teacher.service';
import { UpdateTeacherService } from './services/update-teacher.service';
import { DeleteTeacherService } from './services/delete-teacher.service';
import { GetTeachersService } from './services/get-teachers.service';
import { GetTeacherDetailsService } from './services/get-teacher-details.service';
import { ReorderTeachersService } from './services/reorder-teachers.service';
import { FeatureTeacherService } from './services/feature-teacher.service';
import { ChangeStatusService } from './services/change-status.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Teacher.name, schema: TeacherSchema },
        ]),
        MulterModule.register({
            fileFilter: (_req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                    return cb(new Error('Only image files are allowed'), false);
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    ],
    controllers: [AdminTeacherController, PublicTeacherController],
    providers: [
        CreateTeacherService,
        UpdateTeacherService,
        DeleteTeacherService,
        GetTeachersService,
        GetTeacherDetailsService,
        ReorderTeachersService,
        FeatureTeacherService,
        ChangeStatusService,
    ],
    exports: [GetTeachersService, GetTeacherDetailsService],
})
export class TeacherModule {}
