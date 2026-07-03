import { Controller, Get } from "@nestjs/common";
import {
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

import {
    PendingPaymentsResponseDto,
} from "../dto/pending-payment.dto";

import { GetPendingPaymentsService } from "../services/get-pending-payments.service";

@ApiTags("Admin Dashboard")
@Controller("admin/dashboard")
export class GetPendingPaymentsController {
    constructor(
        private readonly getPendingPaymentsService: GetPendingPaymentsService,
    ) {}

    @Get("pending-payments")
    @ApiOperation({
        summary: "Get pending payments for dashboard",
    })
    @ApiResponse({
        status: 200,
        description: "Pending payments fetched successfully.",
        type: PendingPaymentsResponseDto,
    })
    async execute(): Promise<PendingPaymentsResponseDto> {
        const payments =
            await this.getPendingPaymentsService.execute();

        return {
            payments,
        };
    }
}