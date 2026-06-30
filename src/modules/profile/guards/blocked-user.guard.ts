import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserStatus } from '../../../database/schemas/user.schema';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';


/**
 * Global guard that prevents blocked users from accessing any protected route.
 * Runs after JwtAuthGuard — only checks routes that require authentication.
 */
@Injectable()
export class BlockedUserGuard implements CanActivate {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        // Skip check for public routes
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If no user attached (shouldn't happen for protected routes), skip
        if (!user?.userId) {
            return true;
        }

        // Check if user is still active in database
        const dbUser = await this.userModel
            .findById(user.userId)
            .select('status')
            .lean()
            .exec();

        if (dbUser && dbUser.status === UserStatus.BLOCKED) {
            throw new ForbiddenException('Your account has been suspended. Please contact the administrator.');
        }

        return true;
    }
}
