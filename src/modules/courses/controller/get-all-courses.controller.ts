import {
    Controller,
    Get,
    UseGuards,
} from "@nestjs/common";

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

import { UserRole } from "../../../database/schemas/user.schema";

import { AdminFindAllCoursesService } from "../service/admin-find-all-courses.service";

import { AdminFindAllCoursesResponseDto } from "../dto/admin-find-all-courses-response.dto";

@ApiTags("Admin Courses")
@Controller("admin/courses")
@UseGuards(
    JwtAuthGuard,
    RolesGuard,
)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class GetAllCoursesController {
    constructor(
        private readonly adminFindAllCoursesService: AdminFindAllCoursesService,
    ) {}

    @Get()
    @ApiOperation({
        summary: "Get all courses for admin",
    })
    @ApiResponse({
        status: 200,
        type: [
            AdminFindAllCoursesResponseDto,
        ],
    })
    findAll(): Promise<
        AdminFindAllCoursesResponseDto[]
    > {
        return this.adminFindAllCoursesService.findAll();
    }
}