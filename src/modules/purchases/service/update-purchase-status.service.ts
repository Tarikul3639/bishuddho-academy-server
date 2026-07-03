import {
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Enrollment, EnrollmentStatus } from "../../../database/schemas/enrollment.schema";
import { Payment, PaymentStatus } from "../../../database/schemas/payment.schema";
import { User } from "../../../database/schemas/user.schema";
import { Course } from "../../../database/schemas/course.schema";
import { UpdatePurchaseStatusDto } from "../dto/update-purchase-status.dto";
import { EmailService } from "../../../common/email/services/email.service";
import { EmailSubjects } from "../../../common/email/constants/email-subjects";
import { paymentApprovedTemplate } from "../../../common/email/templates/payment-approved.template";
import { paymentRejectedTemplate } from "../../../common/email/templates/payment-rejected.template";

@Injectable()
export class UpdatePurchaseStatusService {
  private readonly logger = new Logger(UpdatePurchaseStatusService.name);

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    paymentId: string,
    dto: UpdatePurchaseStatusDto,
    adminId?: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new NotFoundException("Payment not found.");
    }

    const enrollment = await this.enrollmentModel.findById(payment.enrollmentId);
    if (!enrollment) {
      throw new NotFoundException("Enrollment not found.");
    }

    const user = await this.userModel.findById(enrollment.userId);
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const course = await this.courseModel.findById(enrollment.courseId);
    if (!course) {
      throw new NotFoundException("Course not found.");
    }

    payment.status = dto.status;
    switch (dto.status) {
      case PaymentStatus.VERIFIED:
        payment.verifiedAt = new Date();
        payment.verifiedBy = adminId ? new Types.ObjectId(adminId) : undefined;
        payment.rejectionReason = undefined;
        enrollment.status = EnrollmentStatus.ACTIVE;
        break;

      case PaymentStatus.REJECTED:
        payment.verifiedAt = undefined;
        payment.verifiedBy = undefined;
        payment.rejectionReason = dto.rejectionReason;
        enrollment.status = EnrollmentStatus.PENDING;
        break;
    }

    await Promise.all([payment.save(), enrollment.save()]);

    const frontendUrl = this.configService.get<string>("FRONTEND_URL") ?? "";

    try {
      if (dto.status === PaymentStatus.VERIFIED) {
        const html = paymentApprovedTemplate({
          name: user.name,
          courseTitle: course.title,
          amount: payment.amount,
          dashboardUrl: `${frontendUrl}/dashboard`,
        });

        await this.emailService.send({
          to: user.email,
          subject: EmailSubjects.PAYMENT_APPROVED,
          html,
        });
      }

      if (dto.status === PaymentStatus.REJECTED) {
        const html = paymentRejectedTemplate({
          name: user.name,
          courseTitle: course.title,
          amount: payment.amount,
          reason: dto.rejectionReason ?? "No reason provided.",
          paymentUrl: `${frontendUrl}/courses/${course._id}`,
        });

        await this.emailService.send({
          to: user.email,
          subject: EmailSubjects.PAYMENT_REJECTED,
          html,
        });
      }
    } catch (error) {
      this.logger.error(
        "Failed to send payment status email.",
        error instanceof Error ? error.stack : undefined,
      );
    }

    return {
      success: true,
      message: `Payment ${dto.status} successfully.`,
    };
  }
}