// public-courses.controller.ts

import {
    Controller,
    Get,
    Param,
    Query,
} from "@nestjs/common";

import {
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

// import { PublicFindCourseDetailsService } from "../service/public-find-course-details.service";
import { PublicFindCoursesService } from "../service/public-find-courses.service";

@ApiTags("Public Courses")
@Controller("public/courses")
export class PublicCoursesController {
    constructor(
        private readonly findPublicCoursesService: PublicFindCoursesService,
        // private readonly findPublicCourseDetailsService: PublicFindCourseDetailsService,
    ) { }

    @Get()
    @ApiOperation({
        summary:
            "Get all public courses",
    })
    findAll(
        @Query("page") page?: number,
        @Query("limit") limit?: number,
    ) {
        return this.findPublicCoursesService.findAll({
            page,
            limit,
        });
    }

    @Get(":courseId")
    @ApiOperation({
        summary:
            "Get public course details",
    })
    findOne(
        @Param("courseId")
        courseId: string,
    ) {
        // return this.findPublicCourseDetailsService.findById(
        //     courseId,
        // );
    }
}