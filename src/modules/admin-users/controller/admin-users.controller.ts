// controller/admin-users.controller.ts

import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from "@nestjs/common";

import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";

import { UserRole, UserStatus } from "../../../database/schemas/user.schema";

import { FindAllUsersService } from "../services/find-all-users.service";
import { FindUserDetailsService } from "../services/find-user-details.service";
import { ToggleUserBlockService } from "../services/toggle-user-block.service";
import { ResetUserPasswordService } from "../services/reset-user-password.service";

import {
    BlockUserDto,
    ResetPasswordDto,
} from "../dto/admin-users-request.dto";

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
    @ApiOperation({
        summary: "Get all users for admin",
    })
    async findAll(
        @Query("search")
        search?: string,

        @Query("status")
        status?: string,
    ): Promise<UserSummaryResponseDto> {
        return this.findAllUsersService.findAll({
            search,
            status,
        });
    }

    @Get(":userId")
    @ApiOperation({
        summary: "Get user details",
    })
    @ApiParam({
        name: "userId",
        type: String,
    })
    async findOne(
        @Param("userId")
        userId: string,
    ) {
        return this.findUserDetailsService.findById(
            userId,
        );
    }

    @Patch(":userId/toggle-block")
    @ApiOperation({
        summary: "Toggle user block status",
    })
    @ApiParam({
        name: "userId",
        type: String,
    })
    async toggleBlock(
        @Param("userId")
        userId: string,

        @Body()
        dto: BlockUserDto,
    ) {
        return this.toggleUserBlockService.toggleBlock(
            userId,
            dto.status,
            dto.reason,
        );
    }

    @Patch(":userId/block")
    @ApiOperation({
        summary: "Block user",
    })
    @ApiParam({
        name: "userId",
        type: String,
    })
    async blockUser(
        @Param("userId")
        userId: string,

        @Body()
        dto: BlockUserDto,
    ) {
        return this.toggleUserBlockService.toggleBlock(
            userId,
            UserStatus.BLOCKED,
            dto.reason,
        );
    }

    @Patch(":userId/unblock")
    @ApiOperation({
        summary: "Unblock user",
    })
    @ApiParam({
        name: "userId",
        type: String,
    })
    async unblockUser(
        @Param("userId")
        userId: string,
    ) {
        return this.toggleUserBlockService.toggleBlock(
            userId,
            UserStatus.ACTIVE,
        );
    }

    @Post(":userId/reset-password")
    @ApiOperation({
        summary: "Reset user password",
    })
    @ApiParam({
        name: "userId",
        type: String,
    })
    async resetPassword(
        @Param("userId")
        userId: string,

        @Body()
        dto: ResetPasswordDto,
    ) {
        return this.resetUserPasswordService.resetPassword(
            userId,
        );
    }
}