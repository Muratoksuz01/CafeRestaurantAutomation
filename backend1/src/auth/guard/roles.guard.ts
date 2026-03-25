
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role.enum';
import { ROLES_KEY } from '../roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
   // console.log("roles guard.ts dosyaısı can activate calişti")
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) return false;
   // console.log(context.switchToHttp().getRequest().user || "yok")
    if (!requiredRoles.includes(user.roleName)) {
      throw new ForbiddenException('Bu işlem için yetkin yok');
    }

    return true;
  }
}
