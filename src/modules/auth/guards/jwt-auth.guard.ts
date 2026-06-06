// auth/guards/jwt-auth.guard.ts

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard
    implements CanActivate
{
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(
        context: ExecutionContext,
    ) {
        const request =
            context
                .switchToHttp()
                .getRequest();

        const token =
            request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException(
                "Unauthenticated",
            );
        }

        try {
            const payload =
                await this.jwtService.verifyAsync(
                    token,
                );

            request.user =
                payload;

            return true;
        } catch {
            throw new UnauthorizedException(
                "Invalid token",
            );
        }
    }
}