import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserStatus } from '../../../database/schemas/user.schema';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class ChangePasswordService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) { }

    async execute(
        userId: string,
        changePasswordDto: ChangePasswordDto,
    ): Promise<{ success: boolean; message: string }> {
        const user = await this.userModel
            .findById(userId)
            .select('+password')
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.status === UserStatus.BLOCKED) {
            throw new ForbiddenException('Your account has been suspended. Please contact the administrator.');
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.password,
        );

        if (!isCurrentPasswordValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        await user.save();

        return {
            success: true,
            message: 'Password changed successfully',
        };
    }
}
