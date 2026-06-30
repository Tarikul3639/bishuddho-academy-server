import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../../../database/schemas/user.schema';
import { ProfileResponseDto } from '../dto/profile-response.dto';

@Injectable()
export class GetProfileService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) { }

    async execute(userId: string): Promise<ProfileResponseDto> {
        const user = await this.userModel.findById(userId).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            alternativePhone: user.alternativePhone,
            dateOfBirth: user.dateOfBirth?.toISOString(),
            gender: user.gender,
            bloodGroup: user.bloodGroup,
            religion: user.religion,
            nationality: user.nationality,
            nidNumber: user.nidNumber,
            birthRegistrationNumber: user.birthRegistrationNumber,
            passportNumber: user.passportNumber,
            rollNumber: user.rollNumber,
            registrationNumber: user.registrationNumber,
            session: user.session,
            department: user.department,
            program: user.program,
            semester: user.semester,
            batch: user.batch,
            admissionDate: user.admissionDate?.toISOString(),
            fatherName: user.fatherName,
            motherName: user.motherName,
            guardianName: user.guardianName,
            guardianPhone: user.guardianPhone,
            guardianOccupation: user.guardianOccupation,
            emergencyContactName: user.emergencyContactName,
            emergencyContactNumber: user.emergencyContactNumber,
            relationship: user.relationship,
            presentAddress: user.presentAddress,
            permanentAddress: user.permanentAddress,
            avatarUrl: user.avatarUrl,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt.toISOString(),
        };
    }
}
