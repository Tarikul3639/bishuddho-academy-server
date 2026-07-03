import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DashboardCoursesResponseDto } from "../dto/dashboard-course.dto";
import { GetDashboardCoursesService } from "../services/get-dashboard-courses.service";

@ApiTags("Admin Dashboard")
@Controller("admin/dashboard")
export class GetDashboardCoursesController {
    constructor(
        private readonly getDashboardCoursesService: GetDashboardCoursesService,
    ) {}

    @Get("courses")
    @ApiOperation({
        summary: "Get dashboard course overview",
    })
    @ApiResponse({
        status: 200,
        description: "Dashboard courses fetched successfully.",
        type: DashboardCoursesResponseDto,
    })
    async execute(): Promise<DashboardCoursesResponseDto> {
        const courses =
            await this.getDashboardCoursesService.execute();

        return {
            courses,
        };
    }
}