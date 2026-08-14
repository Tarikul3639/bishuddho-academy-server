import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Course } from '../../../database/schemas/course.schema';
import { Enrollment } from '../../../database/schemas/enrollment.schema';
import { Certificate } from '../../../database/schemas/certificate.schema';
import { User } from '../../../database/schemas/user.schema';

import {
  CourseCertificateStudentDto,
  CourseCertificateStudentsResponseDto,
} from '../dto/course-certificate-student.dto';

@Injectable()
export class GetCourseCertificatesService {
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,

    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async execute(
    courseId: string,
  ): Promise<CourseCertificateStudentsResponseDto> {
    const course = await this.courseModel.findById(
      new Types.ObjectId(courseId),
    );

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    const enrollments = await this.enrollmentModel
      .find({
        courseId: course._id,
      })
      .lean();

    const students: CourseCertificateStudentDto[] = await Promise.all(
      enrollments.map(async (enrollment) => {
        const [student, certificate] = await Promise.all([
          this.userModel.findById(enrollment.userId),
          this.certificateModel
            .findOne({
              enrollmentId: enrollment._id,
            })
            .lean(),
        ]);

        if (!student) {
          throw new NotFoundException(
            `Student ${enrollment.userId} not found.`,
          );
        }

        return {
          enrollmentId: enrollment._id.toString(),
          studentId: student._id.toString(),
          studentName: student.name,
          studentEmail: student.email,
          certificate: certificate
            ? {
                certificateId: certificate._id.toString(),
                certificateNo: certificate.certificateNo,
                pdfUrl: certificate.pdfUrl,
                issuedAt: certificate.issuedAt,
              }
            : null,
        };
      }),
    );

    return {
      students,
    };
  }
}
