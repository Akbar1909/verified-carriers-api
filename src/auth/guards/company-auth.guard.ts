import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class CompanyAuthGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First use the JwtAuthGuard to validate the token
    const isValid = await super.canActivate(context);

    console.log({isValid})
    
    if (!isValid) {
      return false;
    }
    
    // Now check if the authenticated entity is a company
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log({user})
    
    if (!user.isCompany) {
      throw new UnauthorizedException('This endpoint requires company authentication');
    }


    
    return true;
  }
}