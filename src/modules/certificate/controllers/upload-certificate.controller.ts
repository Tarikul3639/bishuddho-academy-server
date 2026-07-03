import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";

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

import { UploadCertificateDto } from "../dto/upload-certificate.dto";
import { UploadCertificateService } from "../services/upload-certificate.service";
import { CertificateDto } from "../dto/certificate.dto";

@ApiTags("Admin Certificates")
@Controller("admin/certificates")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class UploadCertificateController {
    constructor(
        private readonly uploadCertificateService: UploadCertificateService,
    ) {}

    @Post()
    @ApiOperation({
        summary: "Upload or replace certificate",
    })
    @ApiResponse({
        status: 201,
        type: CertificateDto,
    })
    @UseInterceptors(
        FileInterceptor("pdf"),
    )
    upload(
        @UploadedFile()
        pdf: Express.Multer.File,

        @Body()
        dto: UploadCertificateDto,

        @CurrentUser()
        user: JwtPayload,
    ): Promise<CertificateDto> {
        return this.uploadCertificateService.execute(
            dto,
            pdf,
            user.userId,
        );
    }
}