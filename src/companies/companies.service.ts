import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import * as bcrypt from 'bcrypt';
import { FilterCompanyDto } from './dto/filter-company.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async me(companyId: string) {
    try {
      const result = await this.prisma.company.findUnique({
        where: {
          id: companyId,
        },
      });

      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Company with email not found');
      }

      throw Error;
    }
  }

  // Step 1: Initial company registration with basic info
  async register(registerCompanyDto: RegisterCompanyDto) {
    const { name, workEmail, password } = registerCompanyDto;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create the company with minimal information
      const company = await this.prisma.company.create({
        data: {
          name,
          workEmail,
          password: hashedPassword,
          registrationStatus: 'INITIAL',
          isVerified: false,
          companyLogos: undefined,
          services: undefined,
          reviews: undefined,
          contactInformation: undefined,
          // Set defaults for required fields if any
        },
      });

      // Return company without sensitive information
      const { password: _, ...result } = company;
      return result;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Company with this work email already exists',
        );
      }
      throw error;
    }
  }

  // Fixed method in CompaniesService

  async completeProfile(id: string, updateCompanyDto: UpdateCompanyDto) {
    // Check if company exists
    await this.findOne(id);

    const { logoFileIds, services, contactInformation, ...companyData } =
      updateCompanyDto;

    // Only hash password if provided in the update
    const dataToUpdate = {
      ...companyData,
      registrationStatus: 'COMPLETE' as any,
    };

    // Update company basic info
    await this.prisma.company.update({
      where: { id },
      data: dataToUpdate,
    });

    // Add logos if provided
    if (logoFileIds && logoFileIds.length > 0) {
      for (const fileId of logoFileIds) {
        const companyLogo = await this.prisma.companyLogo.create({
          data: {
            companyId: id,
          },
        });
        await this.filesService.linkToCompanyLogo(fileId, companyLogo.id);
      }
    }
    // Connect existing services via join table (with description)
    if (services?.length) {
      // Optional: clear existing mappings first
      await this.prisma.companyService.deleteMany({
        where: { companyId: id },
      });

      for (const service of services) {
        await this.prisma.companyService.create({
          data: {
            companyId: id,
            serviceId: service.serviceId, // existing service ID
            description: service.description, // custom company-provided description
          },
        });
      }
    }

    // Add contact information if provided
    if (contactInformation && contactInformation.length > 0) {
      for (const contact of contactInformation) {
        await this.prisma.contactInformation.create({
          data: {
            ...contact,
            companyId: id,
          },
        });
      }
    }

    // Return updated company
    return this.findOne(id);
  }

  // Verify a company (admin function)
  async verifyCompany(id: string, adminId: string) {
    return this.prisma.company.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: adminId,
        registrationStatus: 'VERIFIED',
      },
    });
  }

  async findAll({ experience, serviceIds = [] }: FilterCompanyDto) {
    const whereClause: Prisma.CompanyWhereInput = {};


    if (experience) {
      const currentYear = new Date().getFullYear();
      const maxFoundingYear = currentYear - experience;
      whereClause.foundingYear = {
        lte: maxFoundingYear,
        not: null,
      };
    }

    if (serviceIds.length > 0) {
      whereClause.services = {
        some: {
          serviceId: {
            in: serviceIds,
          },
        },
      };
    }

    const [companies, count] = await this.prisma.$transaction([
      this.prisma.company.findMany({
        where: whereClause,

        include: {
          companyLogos: {
            include: {
              file: true,
            },
          },
          services: {
            include: {
              service: {
                select: {
                  serviceName: true,
                  serviceLabel: true,
                },
              },
            },
          },
          contactInformation: true,
        },
      }),
      this.prisma.company.count({ where: whereClause }),
    ]);

    return {
      list: companies,
      total: count,
    };
  }

  async findCount() {
    const currentYear = new Date().getFullYear();

    // Group companies by foundingYear for experience calculation
    const companiesByYear = await this.prisma.company.groupBy({
      by: ['foundingYear'],
      _count: {
        foundingYear: true,
      },
    });

    // Calculate experience buckets
    const experienceResult: Record<1 | 3 | 5 | 7 | 10, number> = {
      1: 0,
      3: 0,
      5: 0,
      7: 0,
      10: 0,
    };

    for (const { foundingYear, _count } of companiesByYear) {
      if (!foundingYear) continue; // skip null foundingYears

      const experience = currentYear - foundingYear;

      if (experience >= 10) {
        experienceResult[10] += _count.foundingYear;
        experienceResult[7] += _count.foundingYear;
        experienceResult[5] += _count.foundingYear;
        experienceResult[3] += _count.foundingYear;
        experienceResult[1] += _count.foundingYear;
      } else if (experience >= 7) {
        experienceResult[7] += _count.foundingYear;
        experienceResult[5] += _count.foundingYear;
        experienceResult[3] += _count.foundingYear;
        experienceResult[1] += _count.foundingYear;
      } else if (experience >= 5) {
        experienceResult[5] += _count.foundingYear;
        experienceResult[3] += _count.foundingYear;
        experienceResult[1] += _count.foundingYear;
      } else if (experience >= 3) {
        experienceResult[3] += _count.foundingYear;
        experienceResult[1] += _count.foundingYear;
      } else if (experience >= 1) {
        experienceResult[1] += _count.foundingYear;
      }
    }

    // Get company counts per service (join table CompanyService)
    const companyServiceCounts = await this.prisma.companyService.groupBy({
      by: ['serviceId'],
      _count: {
        companyId: true,
      },
    });

    // Fetch service details to add names/labels
    const services = await this.prisma.service.findMany({
      where: {
        id: { in: companyServiceCounts.map((c) => c.serviceId) },
      },
    });

    const serviceMap = Object.fromEntries(services.map((s) => [s.id, s]));

    const serviceCounts = companyServiceCounts.map((c) => ({
      serviceId: c.serviceId,
      companyCount: c._count.companyId,
      serviceName: serviceMap[c.serviceId]?.serviceName || '',
      serviceLabel: serviceMap[c.serviceId]?.serviceLabel || '',
    }));

    return {
      experience: experienceResult,
      companyCountsByService: serviceCounts,
    };
  }

  // Find companies with specific registration status
  async findByRegistrationStatus(status: 'INITIAL' | 'COMPLETE' | 'VERIFIED') {
    return this.prisma.company.findMany({
      where: {
        registrationStatus: status,
      },
      include: {
        companyLogos: {
          include: {
            file: true,
          },
        },
        services: true,
        contactInformation: true,
      },
    });
  }

  async findOne(id: string) {
    console.log({ id }, 'test');

    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        companyLogos: {
          include: {
            file: true,
          },
        },
        services: true,
        contactInformation: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                visibleName: true,
              },
            },
            photos: {
              include: {
                file: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    // Remove sensitive information
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = company;
    return result;
  }

  // Find company by work email
  async findByEmail(workEmail: string) {
    const company = await this.prisma.company.findUnique({
      where: { workEmail },
    });

    if (!company) {
      throw new NotFoundException(`Company with email ${workEmail} not found`);
    }

    // Remove sensitive information
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = company;
    return result;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    // Check if company exists
    await this.findOne(id);

    const {
      logoFileIds,
      services = [],
      contactInformation,
      ...companyData
    } = updateCompanyDto;

    // Hash password if provided
    if (companyData.password) {
      companyData.password = await bcrypt.hash(companyData.password, 10);
    }

    // Update company basic info
    await this.prisma.company.update({
      where: { id },
      data: companyData,
    });

    // Update logos if provided
    if (logoFileIds && logoFileIds.length > 0) {
      // Optional: Clear existing logos if needed
      // await this.prisma.companyLogo.deleteMany({ where: { companyId: id } });

      for (const fileId of logoFileIds) {
        const companyLogo = await this.prisma.companyLogo.create({
          data: {
            companyId: id,
          },
        });
        await this.filesService.linkToCompanyLogo(fileId, companyLogo.id);
      }
    }

    if (services?.length) {
      await this.prisma.companyService.deleteMany({
        where: { companyId: id },
      });

      for (const service of services) {
        await this.prisma.companyService.create({
          data: {
            companyId: id,
            serviceId: service.serviceId,
            description: service.description,
          },
        });
      }
    }

    // Update contact information if provided
    if (contactInformation && contactInformation.length > 0) {
      // Optional: Clear existing contact information if needed
      // await this.prisma.contactInformation.deleteMany({ where: { companyId: id } });

      for (const contact of contactInformation) {
        await this.prisma.contactInformation.create({
          data: {
            ...contact,
            companyId: id,
          },
        });
      }
    }

    // Return updated company
    return this.findOne(id);
  }

  async remove(id: string) {
    // Check if company exists
    await this.findOne(id);

    return this.prisma.company.delete({
      where: { id },
    });
  }

  // Methods for managing specific company relations

  async removeLogo(logoId: string) {
    const logo = await this.prisma.companyLogo.findUnique({
      where: { id: logoId },
      include: { file: true },
    });

    if (!logo) {
      throw new NotFoundException(`Logo with ID ${logoId} not found`);
    }

    // Delete the file if it exists
    if (logo.file) {
      await this.filesService.remove(logo.file.id);
    }

    // Delete the logo
    return this.prisma.companyLogo.delete({
      where: { id: logoId },
    });
  }

  async removeService(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    return this.prisma.service.delete({
      where: { id: serviceId },
    });
  }

  async removeContactInformation(contactId: string) {
    const contact = await this.prisma.contactInformation.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException(
        `Contact information with ID ${contactId} not found`,
      );
    }

    return this.prisma.contactInformation.delete({
      where: { id: contactId },
    });
  }
}
