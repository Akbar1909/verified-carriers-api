import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import dayjs from '../common/utils/dayjs.util';

@Injectable()
export class CompanyViewService {
  constructor(private readonly prisma: PrismaService) {}

  async recordView(companyId: string, userId?: string) {
    // 1. Ensure company exists
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) throw new NotFoundException('Company not found');

    // 2. Normalize to "daily" views
    const today = dayjs().startOf('day').toDate();

    try {
      // 3. Upsert (create if not exists, else do nothing)
      await this.prisma.companyView.upsert({
        where: {
          userId_companyId_date: {
            userId: userId ?? 'guest', // fallback for guests
            companyId,
            date: today,
          },
        },
        update: {}, // do nothing if already exists
        create: {
          companyId,
          userId: userId ?? null,
          date: today,
        },
      });

      // 4. Increment viewCount only when inserted
      await this.prisma.company.update({
        where: { id: companyId },
        data: { viewCount: { increment: 1 } },
      });
    } catch (err) {
      // Ignore duplicate errors
    }

    return { success: true };
  }
}
