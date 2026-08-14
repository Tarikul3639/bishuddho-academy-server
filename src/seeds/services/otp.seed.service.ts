import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Otp } from '../../database/schemas/otp.schema';
import { User } from '../../database/schemas/user.schema';

@Injectable()
export class OtpSeedService {
  private readonly logger = new Logger(OtpSeedService.name);
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Started');
    await this.otpModel.deleteMany({}).exec();
    this.logger.log('Deleted existing data');
    const users = await this.userModel
      .find({})
      .select({ email: 1 })
      .lean()
      .exec();
    const otpRecords = await Promise.all(
      users.flatMap((user) => [
        this.createOtp(user.email, 'password_reset'),
        this.createOtp(user.email, 'email_verify'),
      ]),
    );
    await this.otpModel.insertMany(otpRecords);
    this.logger.log(`Inserted ${otpRecords.length} OTP records`);
    this.logger.log('Completed');
  }

  private async createOtp(
    email: string,
    type: 'password_reset' | 'email_verify',
  ): Promise<Record<string, unknown>> {
    return {
      email,
      code: await bcrypt.hash(faker.string.numeric(6), 10),
      type,
      expiresAt: faker.date.soon({ days: 2 }),
      used: faker.datatype.boolean(0.2),
    };
  }
}
