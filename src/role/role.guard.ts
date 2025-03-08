import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY || 'SECRET_KEY',
      );

      request.user = decoded; // ✅ User data ကို request ထဲထည့်မယ်

      const requiredRoles = this.reflector.getAllAndOverride('roles', [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }

      return requiredRoles.includes(decoded.role);
    } catch (error) {
      return false;
    }
  }
}
