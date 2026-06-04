import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { Course, CourseSchema } from '../../database/schemas/course.schema';
import { CreateCourseService } from './service/courses-create.service';
import { CoursesController } from './courses.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
        MulterModule.register({
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.startsWith('image/')) {
                    return cb(new Error('Only image files are allowed'), false);
                }
                cb(null, true);
            },
            limits: { fileSize: 5 * 1024 * 1024 },
        }),
    ],
    controllers: [CoursesController],
    providers: [CreateCourseService],
})
export class CoursesModule { }