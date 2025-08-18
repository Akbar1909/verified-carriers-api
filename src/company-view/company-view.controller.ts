import { Controller, Get, Param, Req } from '@nestjs/common';
import { CompanyViewService } from './company-view.service';
import { JwtService } from '@nestjs/jwt';

@Controller('companies/:companyId/views')
export class CompanyViewController {
  constructor(
    private readonly companyViewService: CompanyViewService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('record')
  async record(
    @Req() req: Request,

    @Param('companyId') companyId: string,
  ) {
    let userId: string | undefined;

    // check if auth header present
    const authHeader = req.headers['authorization'];

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        }); // 👈 decode token
        userId = payload.sub; // or payload.id depending on your JWT
      } catch (err) {
        console.log({ err });
        // invalid token → just ignore, leave userId undefined
      }
    }

    return this.companyViewService.recordView(companyId, userId);
  }
}
