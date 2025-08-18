import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Determine if this is a user or company token
    const { sub, email, type } = payload;

    let entity;

    if (type === 'user') {
      entity = await this.authService.validateUser(sub);
    } else if (type === 'company') {
      entity = await this.authService.validateCompany(sub);
      // Add type property to distinguish in guards
      entity = { ...entity, isCompany: true };
    } else if (type === 'moderator') {
      entity = { ...entity, isModerator: true };
    } else {
      throw new UnauthorizedException('Invalid token type');
    }

    if (!entity) {
      console.log('tes5');
      throw new UnauthorizedException('User not found');
    }

    return entity;
  }
}
