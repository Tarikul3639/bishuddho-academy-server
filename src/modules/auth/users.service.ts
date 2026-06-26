// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './../../database/schemas/user.schema';
import { UpdateProfileDto } from './dto/profile-update.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) { }

    // ─── FIND BY ID ──────────────────────────────────────────────────────────

    async findById(userId: string): Promise<User> {
        const user = await this.userModel.findById(userId).lean();
        if (!user) throw new NotFoundException('User not found.');
        return user;
    }

    // ─── FIND BY EMAIL ───────────────────────────────────────────────────────

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).lean();
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).select('+password').lean();
    }

    // ─── FIND BY USER ID ───────────────────────────────────────────────────────

    async getProfile(userId: string): Promise<ProfileResponseDto> {
        const user = await this.userModel
            .findById(userId)
            .select(
                'name email phone alternativePhone dateOfBirth gender bloodGroup religion nationality ' +
                'nidNumber birthRegistrationNumber passportNumber ' +
                'fatherName motherName guardianName guardianPhone guardianOccupation ' +
                'emergencyContactName emergencyContactNumber relationship ' +
                'presentAddress permanentAddress avatarUrl'
            )
            .lean();

        if (!user) throw new NotFoundException('User not found.');
        return user as ProfileResponseDto;
    }

    // ─── UPDATE PROFILE ──────────────────────────────────────────────────────

    async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
        // console.log('Updating profile for userId:', userId, 'with data:', dto);
        const updated = await this.userModel
            .findByIdAndUpdate(
                userId,
                { $set: dto },
                { new: true, runValidators: true },
            )
            .lean();

        if (!updated) throw new NotFoundException('User not found.');
        return updated;
    }

    // ─── UPDATE LAST LOGIN ───────────────────────────────────────────────────

    async updateLastLogin(userId: string): Promise<void> {
        await this.userModel.findByIdAndUpdate(userId, {
            $set: { lastLogin: new Date() },
        });
    }
}