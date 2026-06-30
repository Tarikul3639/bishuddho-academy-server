import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../../database/schemas/user.schema';

import { CreatePurchaseService } from '../service/create-purchase.service';
import { AdminPurchasesService } from '../service/admin-purchases.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UpdatePurchaseStatusDto } from '../dto/update-purchase-status.dto';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchasesController {
    constructor(
        private readonly createPurchaseService: CreatePurchaseService,
        private readonly adminPurchasesService: AdminPurchasesService,
    ) {}

    /* ── Student: Submit purchase ── */
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Submit a course purchase request' })
    create(
        @CurrentUser('userId') userId: string,
        @Body() dto: CreatePurchaseDto,
    ) {
        return this.createPurchaseService.createPurchase(userId, dto);
    }

    /* ── Admin: Get all purchases ── */
    @Get('admin')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all purchase records (admin)' })
    findAll(
        @Query('status') status?: string,
        @Query('method') method?: string,
        @Query('courseId') courseId?: string,
    ) {
        return this.adminPurchasesService.findAll({ status, method, courseId });
    }

    /* ── Admin: Get single purchase ── */
    @Get('admin/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get purchase details (admin)' })
    findOne(@Param('id') id: string) {
        return this.adminPurchasesService.findOne(id);
    }

    /* ── Admin: Update purchase status ── */
    @Patch('admin/:id/status')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Verify or reject a payment (admin)' })
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdatePurchaseStatusDto,
    ) {
        return this.adminPurchasesService.updateStatus(id, dto);
    }
}
