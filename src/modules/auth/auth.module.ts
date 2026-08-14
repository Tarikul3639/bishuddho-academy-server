// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../../database/schemas/user.schema';
import {
  Enrollment,
  EnrollmentSchema,
} from 'src/database/schemas/enrollment.schema';
import { type StringValue } from 'ms'; // Import the type from ms
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { ResetPasswordController } from './controllers/reset-password.controller';
import { ResetPasswordService } from './services/reset-password.service';

import { ForgotPasswordController } from './controllers/forgot-password.controller';
import { ForgotPasswordService } from './services/forgot-password.service';

import { SignupController } from './controllers/signup.controller';
import { SignupService } from './services/signup.service';

import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
    ]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          // Cast the string as a StringValue to satisfy TypeScript
          expiresIn: configService.get<StringValue>('JWT_ACCESS_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    ResetPasswordController,
    ForgotPasswordController,
    SignupController,
  ],
  providers: [
    AuthService,
    JwtAuthGuard,
    ResetPasswordService,
    ForgotPasswordService,
    SignupService,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
