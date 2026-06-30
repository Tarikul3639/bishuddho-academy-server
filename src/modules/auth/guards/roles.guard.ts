import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Read metadata from decorators
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../interface/jwt-payload';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest<{
            user: JwtPayload;
        }>();

        const user = request.user;

        if (!request.user) throw new ForbiddenException('Access Denied');

        const hasRole = requiredRoles.includes(user.role);

        if (!hasRole) throw new ForbiddenException('Insufficient permissions');

        return true;
    }
}
