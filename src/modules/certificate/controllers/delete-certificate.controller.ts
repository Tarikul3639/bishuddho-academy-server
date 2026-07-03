import {
    Controller,
    Delete,
    Param,
    UseGuards,
} from "@nestjs/common";

import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import type { JwtPayload } from "../../auth/interface/jwt-payload";

import { UserRole } from "../../../database/schemas/user.schema";

import { DeleteCertificateService } from "../services/delete-certificate.service";

@ApiTags("Admin Certificates")
@Controller("admin/certificates")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class DeleteCertificateController {
    constructor(
        private readonly deleteCertificateService: DeleteCertificateService,
    ) {}

    @Delete(":certificateId")
    @ApiOperation({
        summary: "Delete certificate",
    })
    @ApiResponse({
        status: 200,
        description:
            "Certificate deleted successfully",
    })
    delete(
        @Param("certificateId")
        certificateId: string,

        @CurrentUser()
        user: JwtPayload,
    ): Promise<{
        success: boolean;
        message: string;
    }> {
        return this.deleteCertificateService.execute(
            certificateId,
            user.userId,
        );
    }
}