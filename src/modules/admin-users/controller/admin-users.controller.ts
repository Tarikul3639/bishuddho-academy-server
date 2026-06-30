// controller/admin-users.controller.ts

import {
    Controller,
    Get,
    Patch,
    Post,
    Param,
    Query,
    Body,
    UseGuards,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiParam,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../../../database/schemas/user.schema";

import { FindAllUsersService } from "../services/find-all-users.service";
import { FindUserDetailsService } from "../services/find-user-details.service";
import { ToggleUserBlockService } from "../services/toggle-user-block.service";
import { ResetUserPasswordService } from "../services/reset-user-password.service";
import { BlockUserDto, ResetPasswordDto } from "../dto/admin-users-request.dto";
import { UserSummaryResponseDto } from "../dto/admin-users-response.dto";

@ApiTags("Admin Users")
@Controller("admin/users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
    constructor(
        private readonly findAllUsersService: FindAllUsersService,
        private readonly findUserDetailsService: FindUserDetailsService,
        private readonly toggleUserBlockService: ToggleUserBlockService,
        private readonly resetUserPasswordService: ResetUserPasswordService,
    ) {}

    @Get()
    @ApiOperation({ summary: "Get all users for admin" })
    async findAll(
        @Query("search") search?: string,
        @Query("status") status?: string,
    ): Promise<UserSummaryResponseDto> {
        return this.findAllUsersService.findAll({ search, status });
    }

    @Get(":id")
    @ApiOperation({ summary: "Get user details" })
    @ApiParam({ name: "id", type: String })
    async findOne(@Param("id") id: string) {
        return this.findUserDetailsService.findById(id);
    }

    @Patch(":id/toggle-block")
    @ApiOperation({ summary: "Toggle user block status" })
    @ApiParam({ name: "id", type: String })
    async toggleBlock(
        @Param("id") id: string,
        @Body() dto: BlockUserDto,
    ) {
        return this.toggleUserBlockService.toggleBlock(
            id,
            undefined,
            dto?.reason,
        );
    }

    @Patch(":id/block")
    @ApiOperation({ summary: "Block a user" })
    @ApiParam({ name: "id", type: String })
    async blockUser(
        @Param("id") id: string,
        @Body() dto: BlockUserDto,
    ) {
        return this.toggleUserBlockService.toggleBlock(
            id,
            "blocked",
            dto?.reason,
        );
    }

    @Patch(":id/unblock")
    @ApiOperation({ summary: "Unblock a user" })
    @ApiParam({ name: "id", type: String })
    async unblockUser(@Param("id") id: string) {
        return this.toggleUserBlockService.toggleBlock(id, "active");
    }

    @Post(":id/reset-password")
    @ApiOperation({ summary: "Reset user password" })
    @ApiParam({ name: "id", type: String })
    async resetPassword(
        @Param("id") id: string,
        @Body() dto: ResetPasswordDto,
    ) {
        return this.resetUserPasswordService.resetPassword(id);
    }
}
