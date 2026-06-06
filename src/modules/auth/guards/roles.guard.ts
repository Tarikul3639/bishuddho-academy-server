// auth/guards/roles.guard.ts

import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";

import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard
    implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }

    canActivate(
        context: ExecutionContext,
    ) {
        const requiredRoles =
            this.reflector.getAllAndOverride<
                string[]
            >(
                ROLES_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

        if (
            !requiredRoles
        ) {
            return true;
        }

        const request =
            context
                .switchToHttp()
                .getRequest();

        const user =
            request.user;

        return requiredRoles.includes(
            user.role,
        );
    }
}