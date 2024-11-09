import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get<Role>(
            ROLE_KEY,
            context.getHandler(),
        );

        if (!requiredRole) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        console.log(user.role, requiredRole);
        return user.role === requiredRole;
    }
}
