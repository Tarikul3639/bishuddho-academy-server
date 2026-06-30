import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfileController } from './controller/profile.controller';
import { GetProfileService } from './services/get-profile.service';
import { UpdateProfileService } from './services/update-profile.service';
import { ChangePasswordService } from './services/change-password.service';
import { BlockedUserGuard } from './guards/blocked-user.guard';
import { User, UserSchema } from '../../database/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
        AuthModule,
    ],
    controllers: [ProfileController],
    providers: [GetProfileService, UpdateProfileService, ChangePasswordService, BlockedUserGuard],
    exports: [GetProfileService, UpdateProfileService, ChangePasswordService, BlockedUserGuard],
})
export class ProfileModule { }
