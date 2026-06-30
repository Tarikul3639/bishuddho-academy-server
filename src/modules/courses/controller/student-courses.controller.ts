import {
    Controller,
    Delete,
    Get,
    Param,
    Req,
    UseGuards,
} from "@nestjs/common";

import {
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";

import { StudentMyCourseResponseDto } from "../dto/student-my-course-response.dto";
import { StudentFindMyCoursesService } from "../service/student-find-my-courses.service";
import { StudentCourseDetailsResponseDto } from "../dto/student-course-details-response.dto";
import { StudentFindCourseDetailsService } from "../service/student-find-course-details.service";
import { StudentCancelEnrollmentService } from "../service/student-cancel-enrollment.service";

@ApiTags("Student Courses")
@Controller("student/courses")
@UseGuards(JwtAuthGuard)
export class StudentCoursesController {
    constructor(
        private readonly studentFindMyCoursesService: StudentFindMyCoursesService,
        private readonly studentFindCourseDetailsService: StudentFindCourseDetailsService,
        private readonly studentCancelEnrollmentService: StudentCancelEnrollmentService,
    ) { }

    @Get()
    @ApiOperation({
        summary:
            "Get logged in student's courses",
    })
    async getMyCourses(
        @CurrentUser("userId")
        userId: string,
    ): Promise<StudentMyCourseResponseDto[]> {
        return this.studentFindMyCoursesService.findMyCourses(
            userId,
        );
    }

    @Get(":courseId")
    @ApiOperation({
        summary:
            "Get enrolled course details",
    })
    async getCourseDetails(
        @Req() req: any,
        @Param("courseId")
        courseId: string,
    ): Promise<StudentCourseDetailsResponseDto> {
        return this.studentFindCourseDetailsService.findById(
            req.user.userId,
            courseId,
        );
    }

    @Delete(":courseId")
    @ApiOperation({
        summary: "Cancel course enrollment",
    })
    async cancelEnrollment(
        @CurrentUser("userId")
        userId: string,

        @Param("courseId")
        courseId: string,
    ) {
        return this.studentCancelEnrollmentService.cancelEnrollment(
            userId,
            courseId,
        );
    }
}