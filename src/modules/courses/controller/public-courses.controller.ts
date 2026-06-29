import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
} from "@nestjs/common";

import {
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

import { CurrentUser } from "src/modules/auth/decorators/current-user.decorator";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { JwtAuthGuard } from "src/modules/auth/guards/jwt-auth.guard";

import { PublicFindCoursesService } from "../service/public-find-courses.service";
import { PublicFindCourseDetailsService } from "../service/public-find-course-details.service";

@UseGuards(JwtAuthGuard)
@ApiTags("Public Courses")
@Controller("public/courses")
export class PublicCoursesController {
    constructor(
        private readonly findPublicCoursesService: PublicFindCoursesService,
        private readonly findPublicCourseDetailsService: PublicFindCourseDetailsService,
    ) {}

    @Public()
    @Get()
    @ApiOperation({
        summary: "Get all public courses",
    })
    findAll(
        @Query("page") page?: number,
        @Query("limit") limit?: number,

        @CurrentUser("userId")
        userId?: string,
    ) {
        return this.findPublicCoursesService.findAll({
            page,
            limit,
            userId,
        });
    }

    @Public()
    @Get(":courseId")
    @ApiOperation({
        summary: "Get public course details",
    })
    findOne(
        @Param("courseId")
        courseId: string,

        @CurrentUser("userId")
        userId?: string,
    ) {
        return this.findPublicCourseDetailsService.findById(
            courseId,
            userId,
        );
    }
}