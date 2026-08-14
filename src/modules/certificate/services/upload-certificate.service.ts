import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  CloudinaryService,
  CloudinaryUploadResult,
} from '../../../common/cloudinary/cloudinary.service';

import { Certificate } from '../../../database/schemas/certificate.schema';
import {
  Enrollment,
  EnrollmentStatus,
} from '../../../database/schemas/enrollment.schema';
import { Course, CourseStatus } from '../../../database/schemas/course.schema';
import { User } from '../../../database/schemas/user.schema';

import { UploadCertificateDto } from '../dto/upload-certificate.dto';
import { CertificateDto } from '../dto/certificate.dto';

@Injectable()
export class UploadCertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,

    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<Enrollment>,

    @InjectModel(Course.name)
    private readonly courseModel: Model<Course>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    dto: UploadCertificateDto,
    file: Express.Multer.File,
    adminId: string,
  ): Promise<CertificateDto> {
    if (!file) {
      throw new BadRequestException('Certificate PDF is required.');
    }

    const enrollment = await this.enrollmentModel.findById(dto.enrollmentId);

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found.');
    }

    if (enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new BadRequestException(
        'Only active enrollments can receive certificates.',
      );
    }

    const [course, student] = await Promise.all([
      this.courseModel.findById(enrollment.courseId),
      this.userModel.findById(enrollment.userId),
    ]);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    if (!student) {
      throw new NotFoundException('Student not found.');
    }

    if (course.status !== CourseStatus.COMPLETED) {
      throw new BadRequestException(
        'Course must be completed before uploading certificates.',
      );
    }

    let certificate = await this.certificateModel.findOne({
      enrollmentId: enrollment._id,
    });

    let uploadResult: CloudinaryUploadResult;

    if (certificate) {
      uploadResult = await this.cloudinaryService.replaceFile(
        file,
        'bishuddho-academy/certificates',
        certificate.cloudinaryPublicId,
        'raw',
      );
    } else {
      uploadResult = await this.cloudinaryService.uploadFile(
        file,
        'bishuddho-academy/certificates',
        'raw',
      );
    }

    if (certificate) {
      certificate.certificateNo = dto.certificateNo;
      certificate.pdfUrl = uploadResult.secureUrl;
      certificate.cloudinaryPublicId = uploadResult.publicId;
      certificate.uploadedBy = new Types.ObjectId(adminId);
      certificate.issuedAt = new Date();

      await certificate.save();
    } else {
      certificate = await this.certificateModel.create({
        enrollmentId: enrollment._id,
        studentId: student._id,
        courseId: course._id,
        certificateNo: dto.certificateNo,
        pdfUrl: uploadResult.secureUrl,
        cloudinaryPublicId: uploadResult.publicId,
        uploadedBy: new Types.ObjectId(adminId),
        issuedAt: new Date(),
      });
    }

    return {
      certificateId: certificate._id.toString(),
      enrollmentId: enrollment._id.toString(),
      studentId: student._id.toString(),
      studentName: student.name,
      studentEmail: student.email,
      courseId: course._id.toString(),
      courseTitle: course.title,
      certificateNo: certificate.certificateNo,
      pdfUrl: certificate.pdfUrl,
      uploadedBy: adminId,
      issuedAt: certificate.issuedAt,
    };
  }
}
