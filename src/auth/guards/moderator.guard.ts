import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ModeratorGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

   

    // Check if user is a moderator
    if (user?.type !== 'moderator') {
      throw new ForbiddenException('Access denied. Moderator role required.');
    }

    // Check if moderator is active
    if (user?.status !== 'ACTIVE') {
      throw new ForbiddenException('Access denied. Account is not active.');
    }

    return true;
  }
}
