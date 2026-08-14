import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from '../../../database/schemas/user.schema';

import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResetPasswordResponseDto } from '../dto/reset-password.response.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async execute(dto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match.');
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(dto.token)
      .digest('hex');

    const user = await this.userModel.findOne({
      passwordResetToken: hashedToken,

      passwordResetExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid or expired reset token.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    user.password = hashedPassword;

    user.passwordResetToken = undefined;

    user.passwordResetExpires = undefined;

    await user.save();

    return {
      success: true,
      message: 'Password reset successfully.',
    };
  }
}
