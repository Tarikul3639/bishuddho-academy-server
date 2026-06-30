import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';

import { CoursesModule } from './modules/courses/courses.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { BlockedUserGuard } from './modules/profile/guards/blocked-user.guard';

// _-_-_-_ Auth _-_-_-
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';

// _-_-_-_ Seed _-_-_-.
import { SeedModule } from './seeds/seed.module';
import { User, UserSchema } from './database/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.development', '.env'],
      validationSchema: envValidationSchema,
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 60 sec
          limit: 20,  // max 20 requests
        },
      ],
    }),

    DatabaseModule,
    AuthModule,
    ProfileModule,
    CoursesModule,
    PurchasesModule,
    AdminUsersModule,

    SeedModule,
  ],

  controllers: [],

  providers: [
    // Global rate limit guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global blocked user guard
    {
      provide: APP_GUARD,
      useClass: BlockedUserGuard,
    },
  ],
})
export class AppModule { }