import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";

import type { Request } from "express";

import { JwtPayload } from "../interface/jwt-payload";

@Injectable()
export class JwtAuthGuard
    implements CanActivate
{
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request =
            context
                .switchToHttp()
                .getRequest<
                    Request & {
                        user?: JwtPayload;
                    }
                >();

        const token =
            request.cookies?.access_token;

        if (!token) {
            throw new UnauthorizedException(
                "Unauthenticated",
            );
        }

        try {
            const payload =
                await this.jwtService.verifyAsync<JwtPayload>(
                    token,
                );

            request.user =
                payload;

            return true;
        } catch {
            throw new UnauthorizedException(
                "Invalid or expired token",
            );
        }
    }
}