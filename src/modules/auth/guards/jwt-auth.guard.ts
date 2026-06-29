import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import type { Request } from "express";

import { JwtPayload } from "../interface/jwt-payload";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAuthGuard
    implements CanActivate
{
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const isPublic =
            this.reflector.getAllAndOverride<boolean>(
                IS_PUBLIC_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

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

        /*
         * Public Route
         */
        if (isPublic) {
            if (!token) {
                return true;
            }

            try {
                const payload =
                    await this.jwtService.verifyAsync<JwtPayload>(
                        token,
                    );

                request.user = payload;
            } catch {
                /*
                 * Ignore invalid token
                 */
            }

            return true;
        }

        /*
         * Protected Route
         */

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

            request.user = payload;

            return true;
        } catch {
            throw new UnauthorizedException(
                "Invalid or expired token",
            );
        }
    }
}