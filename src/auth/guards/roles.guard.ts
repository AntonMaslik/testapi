import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from '../roles/roles/roles.enum';
{
    ROLES_KEY;
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();

        const roles = user.userDb.roles;

        const requiredRoles = new Set(
            this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]),
        );

        if (!requiredRoles.size) {
            requiredRoles.add(Role.USER);
        }

        for (const role of roles) {
            if (requiredRoles.has(role.name)) {
                return true;
            }
        }

        return false;
    }
}
