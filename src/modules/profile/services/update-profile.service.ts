import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserStatus } from '../../../database/schemas/user.schema';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileResponseDto } from '../dto/profile-response.dto';

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
        const user = await this.userModel
            .findById(userId)
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.status === UserStatus.BLOCKED) {
            throw new ForbiddenException('Your account has been suspended. Please contact the administrator.');
        }

        Object.assign(user, updateProfileDto);
        await user.save();

        const raw = JSON.parse(JSON.stringify(user)) as Record<string, any>;
        const { password, __v, ...rest } = raw;
        return rest as unknown as ProfileResponseDto;
    }
}
