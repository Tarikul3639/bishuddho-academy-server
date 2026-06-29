import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { Payment, PaymentStatus } from "../../../database/schemas/payment.schema";
import { Enrollment, EnrollmentStatus } from "../../../database/schemas/enrollment.schema";

@Injectable()
export class AdminRejectPaymentService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,

    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,

    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,
  ) {}

  async reject(paymentId: string, reason: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const payment = await this.paymentModel
        .findById(paymentId)
        .session(session);

      if (!payment) {
        throw new NotFoundException("Payment not found");
      }

      if (payment.status === PaymentStatus.REJECTED) {
        throw new BadRequestException("Payment already rejected");
      }

      const enrollment = await this.enrollmentModel
        .findById(payment.enrollmentId)
        .session(session);

      if (!enrollment) {
        throw new NotFoundException("Enrollment not found");
      }

      /* -----------------------------
         PAYMENT UPDATE
      ------------------------------ */
      payment.status = PaymentStatus.REJECTED;
      payment.rejectionReason = reason;
      payment.verifiedAt = undefined;
      payment.verifiedBy = undefined;

      await payment.save({ session });

      /* -----------------------------
         ENROLLMENT UPDATE
      ------------------------------ */
      enrollment.status = EnrollmentStatus.PENDING;

      await enrollment.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}