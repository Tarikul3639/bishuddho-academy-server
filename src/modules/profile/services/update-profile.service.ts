import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
    User,
    UserStatus,
} from "../../../database/schemas/user.schema";

import { UpdateProfileDto } from "../dto/update-profile.dto";
import { ProfileResponseDto } from "../dto/profile-response.dto";

@Injectable()
export class UpdateProfileService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) { }

    async execute(
        userId: string,
        updateProfileDto: UpdateProfileDto,
    ): Promise<ProfileResponseDto> {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        if (user.status === UserStatus.BLOCKED) {
            throw new ForbiddenException(
                "Your account has been suspended. Please contact the administrator.",
            );
        }

        /* ------------------------------------------------------------------
           Partial Update
           Email, Password, Role, Status, StudentId cannot be updated here.
        ------------------------------------------------------------------- */

        const {
            email,
            password,
            role,
            status,
            studentId,
            ...allowedUpdates
        } = updateProfileDto as UpdateProfileDto & {
            email?: never;
            password?: never;
            role?: never;
            status?: never;
            studentId?: never;
        };

        (
            Object.keys(
                allowedUpdates,
            ) as (keyof typeof allowedUpdates)[]
        ).forEach((key) => {
            const value = allowedUpdates[key];

            if (value !== undefined) {
                user.set(key, value);
            }
        });

        await user.save();

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
            birthRegistrationNumber:
                user.birthRegistrationNumber,
            passportNumber: user.passportNumber,

            rollNumber: user.rollNumber,
            registrationNumber:
                user.registrationNumber,

            session: user.session,
            department: user.department,
            program: user.program,
            semester: user.semester,
            batch: user.batch,

            admissionDate:
                user.admissionDate?.toISOString(),

            fatherName: user.fatherName,
            motherName: user.motherName,

            guardianName: user.guardianName,
            guardianPhone: user.guardianPhone,
            guardianOccupation:
                user.guardianOccupation,

            emergencyContactName:
                user.emergencyContactName,
            emergencyContactNumber:
                user.emergencyContactNumber,
            relationship: user.relationship,

            presentAddress: user.presentAddress,
            permanentAddress:
                user.permanentAddress,

            avatarUrl: user.avatarUrl,

            enrolledCourses: undefined,

            createdAt:
                user.createdAt.toISOString(),

            role: user.role,
            status: user.status,
        };
    }
}