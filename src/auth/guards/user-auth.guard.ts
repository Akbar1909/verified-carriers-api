// src/auth/guards/user-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class UserAuthGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First use the JwtAuthGuard to validate the token
    const isValid = await super.canActivate(context);

    if (!isValid) {
      return false;
    }

    // Now check if the authenticated entity is a user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user.isCompany) {
      throw new UnauthorizedException(
        'This endpoint requires user authentication',
      );
    }

    return true;
  }
}
