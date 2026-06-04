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
    UseGuards,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
// import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { CreateCourseService } from "./service/courses-create.service";
// import { CourseResponseDto } from "./dto/course-response.dto";
// import { UpdateCourseDto } from "./dto/update-course.dto";
import { CreateCourseDto } from "./dto/create-course.dto";

@ApiTags("Courses")
@Controller("courses")
export class CoursesController {

    constructor(private readonly createCourseService: CreateCourseService) { }

    /* ADD COURSE */
    @Post()
    // @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new course' })
    @ApiResponse({ status: 201, description: 'Course successfully created.' })
    // @UseInterceptors(FileInterceptor("thumbnailFile"))
    @UseInterceptors(
        FileInterceptor('thumbnailFile', {
            storage: diskStorage({
                destination: join(process.cwd(), 'public', 'uploads', 'courses', 'thumbnails'),
                filename: (req, file, cb) => {
                    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    cb(null, `${unique}${extname(file.originalname)}`);
                },
            }),
        })
    )
    create(
        @UploadedFile() thumbnailFile: Express.Multer.File,
        @Body("courseData")
        courseData: string,
    ) {
        const dto: CreateCourseDto =
            JSON.parse(courseData);

        return this.createCourseService.create(
            dto,
            thumbnailFile,
        );
    }

    /* GET ALL COURSES */
    @Get()
    @ApiOperation({ summary: 'Retrieve all courses' })
    @ApiResponse({ status: 200, description: 'List of all courses returned successfully.' })
    findAll() {
        return "Get all courses endpoint";
    }

    /* GET ONE */
    @Get(":courseId")
    @ApiOperation({ summary: 'Retrieve a specific course by ID' })
    @ApiResponse({ status: 200, description: 'Course details retrieved successfully.' })
    findOne(@Param("courseId") courseId: string) {
        return `Get course with ID ${courseId} endpoint`;
    }

    /* UPDATE */
    @Patch(":courseId")
    // @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update course information' })
    @ApiResponse({ status: 200, description: 'Course updated successfully.' })
    update(@Param("courseId") courseId: string, @Body() body: any) {
        return `Update course with ID ${courseId} endpoint`;
    }

    /* DELETE */
    @Delete(":courseId")
    // @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a course' })
    @ApiResponse({ status: 200, description: 'Course successfully deleted.' })
    remove(@Param("courseId") courseId: string) {
        return `Delete course with ID ${courseId} endpoint`;
    }
}