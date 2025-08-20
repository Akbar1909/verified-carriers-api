// saved-company.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SavedCompanyService {
  constructor(private prisma: PrismaService) {}

  async saveCompany(userId: string, companyId: string) {
    try {
      return await this.prisma.savedCompany.create({
        data: { userId, companyId },
      });
    } catch (e) {
      throw new BadRequestException('Already saved or invalid company.');
    }
  }

  async unsaveCompany(userId: string, companyId: string) {
    return this.prisma.savedCompany.delete({
      where: { userId_companyId: { userId, companyId } },
    });
  }

  async listSavedCompanies(userId: string) {
    const savedCompanies = await this.prisma.savedCompany.findMany({
      where: { userId },
      include: {
        company: {
          include: {
            companyLogos: {
              take: 1,
              include: { file: true },
            },
            services: {
              include: {
                service: {
                  select: {
                    serviceLabel: true,
                    serviceName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return savedCompanies.map(({ company }) => ({
      ...company,
      isSaved: true, // since it's in saved list
    }));
  }
}
