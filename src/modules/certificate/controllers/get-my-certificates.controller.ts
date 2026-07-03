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

import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import type { JwtPayload } from "../../auth/interface/jwt-payload";

import { GetMyCertificatesService } from "../services/get-my-certificates.service";
import { CertificateDto } from "../dto/certificate.dto";

@ApiTags("Certificates")
@Controller("me/certificates")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GetMyCertificatesController {
    constructor(
        private readonly getMyCertificatesService: GetMyCertificatesService,
    ) {}

    @Get()
    @ApiOperation({
        summary: "Get my certificates",
    })
    @ApiResponse({
        status: 200,
        type: [CertificateDto],
    })
    findMine(
        @CurrentUser()
        user: JwtPayload,
    ): Promise<CertificateDto[]> {
        return this.getMyCertificatesService.execute(
            user.userId,
        );
    }
}