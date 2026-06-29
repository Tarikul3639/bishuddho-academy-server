// admin-courses.controller.ts

import { diskStorage } from "multer";
import { extname, join } from "path";

import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Patch,
    Delete,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";

import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from "@nestjs/swagger";

import { AdminCreateCourseService } from "../service/admin-courses-create.service";
import { AdminFindAllCoursesService } from "../service/admin-find-all-courses.service";
import { AdminFindCourseDetailsService } from "../service/admin-find-courses-details.service";
import { AdminUpdateCourseService } from "../service/admin-update-course.service";

import { AdminCreateCourseDto } from "../dto/admin-create-course.dto";
import { AdminUpdateCourseDto } from "../dto/admin-update-course.dto";
import { AdminFindAllCoursesResponseDto } from "../dto/admin-find-all-courses-response.dto";
import { AdminFindCourseDetailsResponseDto } from "../dto/admin-find-course-details-response.dto";
import { AdminVerifyPaymentService } from "../service/admin-verify-payment.service";
import { AdminRejectPaymentService } from "../service/admin-reject-payment.service";
import { AdminRejectPaymentDto } from "../dto/admin-reject-payment.dto";

@ApiTags("Admin Courses")
@Controller("admin/courses")
export class AdminCoursesController {
    constructor(
        private readonly adminCreateCourseService: AdminCreateCourseService,
        private readonly adminFindAllCoursesService: AdminFindAllCoursesService,
        private readonly adminFindCourseDetailsService: AdminFindCourseDetailsService,
        private readonly adminUpdateCourseService: AdminUpdateCourseService,
        private readonly adminVerifyPaymentService: AdminVerifyPaymentService,
        private readonly adminRejectPaymentService: AdminRejectPaymentService,
    ) { }

    /* CREATE COURSE */
    @Post()
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Create a new course",
    })
    @ApiResponse({
        status: 201,
        description: "Course created successfully",
    })
    @UseInterceptors(
        FileInterceptor("thumbnailFile", {
            storage: diskStorage({
                destination: join(
                    process.cwd(),
                    "public",
                    "uploads",
                    "courses",
                    "thumbnails",
                ),
                filename: (
                    req,
                    file,
                    cb,
                ) => {
                    const unique =
                        `${Date.now()}-${Math.round(
                            Math.random() * 1e9,
                        )}`;

                    cb(
                        null,
                        `${unique}${extname(
                            file.originalname,
                        )}`,
                    );
                },
            }),
        }),
    )
    create(
        @UploadedFile()
        thumbnailFile: Express.Multer.File,

        @Body("courseData")
        courseData: string,
    ) {
        const dto: AdminCreateCourseDto =
            JSON.parse(courseData);

        return this.adminCreateCourseService.create(
            dto,
            thumbnailFile,
        );
    }

    /* GET ALL COURSES */
    @Get()
    @ApiOperation({
        summary:
            "Get all courses for admin",
    })
    @ApiResponse({
        status: 200,
        type: [AdminFindAllCoursesResponseDto],
    })
    findAll(): Promise<
        AdminFindAllCoursesResponseDto[]
    > {
        return this.adminFindAllCoursesService.findAll();
    }

    /* GET COURSE DETAILS */
    @Get(":courseId")
    @ApiOperation({
        summary:
            "Get course details for admin",
    })
    @ApiResponse({
        status: 200,
        type: AdminFindCourseDetailsResponseDto,
    })
    findOne(
        @Param("courseId")
        courseId: string,
    ): Promise<AdminFindCourseDetailsResponseDto> {
        return this.adminFindCourseDetailsService.findById(
            courseId,
        );
    }

    /* UPDATE COURSE */
    @Patch(":courseId")
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Update course",
    })
    @ApiResponse({
        status: 200,
        description:
            "Course updated successfully",
    })
    @UseInterceptors(
        FileInterceptor("thumbnailFile", {
            storage: diskStorage({
                destination: join(
                    process.cwd(),
                    "public",
                    "uploads",
                    "courses",
                    "thumbnails",
                ),
                filename: (
                    req,
                    file,
                    cb,
                ) => {
                    const unique =
                        `${Date.now()}-${Math.round(
                            Math.random() * 1e9,
                        )}`;

                    cb(
                        null,
                        `${unique}${extname(
                            file.originalname,
                        )}`,
                    );
                },
            }),
        }),
    )
    update(
        @Param("courseId")
        courseId: string,

        @UploadedFile()
        thumbnailFile: Express.Multer.File,

        @Body("courseData")
        courseData: string,
    ) {
        const dto: AdminUpdateCourseDto =
            JSON.parse(courseData);

        return this.adminUpdateCourseService.update(
            courseId,
            thumbnailFile,
            dto,
        );
    }

    /* DELETE COURSE */
    @Delete(":courseId")
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Delete course",
    })
    @ApiResponse({
        status: 200,
        description:
            "Course deleted successfully",
    })
    remove(
        @Param("courseId")
        courseId: string,
    ) {
        return `Delete course with ID ${courseId}`;
    }

    // PAYMENT VERIFICATION
    @Patch("payments/:paymentId/verify")
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Verify payment",
    })
    @ApiResponse({
        status: 200,
        description: "Payment verified successfully",
    })
    verifyPayment(
        @Param("paymentId")
        paymentId: string,
    ) {
        return this.adminVerifyPaymentService.verify(
            paymentId,
        );
    }

    // PAYMENT REJECTION
    @Patch("payments/:paymentId/reject")
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Reject payment",
    })
    @ApiResponse({
        status: 200,
        description: "Payment rejected successfully",
    })
    rejectPayment(
        @Param("paymentId")
        paymentId: string,

        @Body()
        dto: AdminRejectPaymentDto,
    ) {
        return this.adminRejectPaymentService.reject(
            paymentId,
            dto.reason,
        );
    }
}