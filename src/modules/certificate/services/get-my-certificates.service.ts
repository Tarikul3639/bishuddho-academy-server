import {
    Injectable,
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Certificate } from "../../../database/schemas/certificate.schema";
import { Course } from "../../../database/schemas/course.schema";

import { CertificateDto } from "../dto/certificate.dto";

@Injectable()
export class GetMyCertificatesService {
    constructor(
        @InjectModel(Certificate.name)
        private readonly certificateModel: Model<Certificate>,

        @InjectModel(Course.name)
        private readonly courseModel: Model<Course>,
    ) { }

    async execute(
        studentId: string,
    ): Promise<CertificateDto[]> {
        const certificates =
            await this.certificateModel
                .find({
                    studentId: new Types.ObjectId(
                        studentId,
                    ),
                })
                .sort({
                    issuedAt: -1,
                });

        const result =
            await Promise.all(
                certificates.map(
                    async (certificate) => {
                        const course =
                            await this.courseModel.findById(
                                certificate.courseId,
                            );

                        return {
                            certificateId:
                                certificate._id.toString(),

                            enrollmentId:
                                certificate.enrollmentId.toString(),

                            studentId:
                                certificate.studentId.toString(),

                            studentName: "",

                            studentEmail: "",

                            courseId:
                                certificate.courseId.toString(),

                            courseTitle:
                                course?.title ??
                                "Unknown Course",

                            certificateNo:
                                certificate.certificateNo,

                            pdfUrl:
                                certificate.pdfUrl,

                            uploadedBy:
                                certificate.uploadedBy.toString(),

                            issuedAt:
                                certificate.issuedAt,
                        };
                    },
                ),
            );

        return result;
    }
}