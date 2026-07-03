// service/admin-purchases.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Payment } from "../../../database/schemas/payment.schema";

@Injectable()
export class AdminPurchasesService {
  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
  ) {}

  async findAll(filter?: { status?: string; method?: string; courseId?: string }) {
    const paymentQuery: any = {};

    if (filter?.status) paymentQuery.status = filter.status;
    if (filter?.method) paymentQuery.method = filter.method;

    const payments = await this.paymentModel
      .find(paymentQuery)
      .populate({
        path: "enrollmentId",
        populate: [
          { path: "courseId", select: "title thumbnailUrl" },
          { path: "userId", select: "name email" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const filteredPayments = filter?.courseId
      ? payments.filter(
          (payment: any) =>
            payment.enrollmentId?.courseId?._id?.toString() === filter.courseId,
        )
      : payments;

    return filteredPayments.map((payment: any) => {
      const enrollment = payment.enrollmentId;
      const course = enrollment?.courseId;
      const user = enrollment?.userId;

      return {
        id: payment._id.toString(),
        enrollmentId: enrollment?._id?.toString() || "",
        courseId: course?._id?.toString() || "",
        courseTitle: course?.title || "Unknown Course",
        courseThumbnail: course?.thumbnailUrl || "",
        studentId: user?._id?.toString() || "",
        studentName: user?.name || "Unknown",
        studentEmail: user?.email || "",
        method: payment.method,
        trxId: payment.trxId || null,
        amount: payment.amount,
        paymentStatus: payment.status,
        enrollmentStatus: enrollment?.status,
        paidAt: payment.paidAt,
        verifiedAt: payment.verifiedAt,
        rejectionReason: payment.rejectionReason,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      };
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentModel
      .findById(id)
      .populate({
        path: "enrollmentId",
        populate: [
          { path: "courseId", select: "title thumbnailUrl price" },
          { path: "userId", select: "name email phone" },
        ],
      })
      .lean()
      .exec();

    if (!payment) {
      throw new NotFoundException("Purchase record not found");
    }

    const enrollment: any = payment.enrollmentId;
    const course = enrollment?.courseId;
    const user = enrollment?.userId;

    return {
      id: payment._id.toString(),
      enrollmentId: enrollment?._id?.toString() || "",
      courseId: course?._id?.toString() || "",
      courseTitle: course?.title || "Unknown Course",
      courseThumbnail: course?.thumbnailUrl || "",
      coursePrice: course?.price || 0,
      studentId: user?._id?.toString() || "",
      studentName: user?.name || "Unknown",
      studentEmail: user?.email || "",
      studentPhone: user?.phone || null,
      method: payment.method,
      trxId: payment.trxId || null,
      amount: payment.amount,
      paymentStatus: payment.status,
      enrollmentStatus: enrollment?.status,
      paidAt: payment.paidAt,
      verifiedBy: payment.verifiedBy?.toString(),
      verifiedAt: payment.verifiedAt,
      rejectionReason: payment.rejectionReason,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}