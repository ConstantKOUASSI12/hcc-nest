import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from 'src/entity/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user.isValidated){
      throw new ForbiddenException("Account not validated, please contact the administrator");
    }
    
    if (!requiredRoles.includes(user.role.name)) {
      throw new ForbiddenException(
        "Access denied: this resource does not belong to you"
      );
    }

    return requiredRoles.includes(user.role.name);
  }
}
