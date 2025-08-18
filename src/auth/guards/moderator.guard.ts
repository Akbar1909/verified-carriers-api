import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class ModeratorGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First use the JwtAuthGuard to validate the token
    const isValid = await super.canActivate(context);

    console.log({ isValid });

    if (!isValid) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is a moderator
    if (!user?.isModerator) {
      throw new ForbiddenException('Access denied. Moderator role required.');
    }

    return true;
  }
}
