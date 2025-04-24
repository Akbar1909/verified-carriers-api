import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { logoFileIds, services, contactInformation, ...companyData } = createCompanyDto;
    
    // Hash password if provided
    if (companyData.password) {
      companyData.password = await bcrypt.hash(companyData.password, 10);
    }
    
    try {
      // Create the company
      const company = await this.prisma.company.create({
        data: companyData,
      });
      
      // Add logos if provided
      if (logoFileIds && logoFileIds.length > 0) {
        for (const fileId of logoFileIds) {
          const companyLogo = await this.prisma.companyLogo.create({
            data: {
              companyId: company.id,
            },
          });
          await this.filesService.linkToCompanyLogo(fileId, companyLogo.id);
        }
      }
      
      // Add services if provided
      if (services && services.length > 0) {
        for (const service of services) {
          await this.prisma.service.create({
            data: {
              ...service,
              companyId: company.id,
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
              companyId: company.id,
            },
          });
        }
      }
      
      // Return company with all relations
      return this.findOne(company.id);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Company with this MC#, USDOT# or work email already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.company.findMany({
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
    const { password, ...result } = company;
    return result;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    // Check if company exists
    await this.findOne(id);
    
    const { logoFileIds, services, contactInformation, ...companyData } = updateCompanyDto;
    
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
    
    // Update services if provided
    if (services && services.length > 0) {
      // Optional: Clear existing services if needed
      // await this.prisma.service.deleteMany({ where: { companyId: id } });
      
      for (const service of services) {
        await this.prisma.service.create({
          data: {
            ...service,
            companyId: id,
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
      throw new NotFoundException(`Contact information with ID ${contactId} not found`);
    }
    
    return this.prisma.contactInformation.delete({
      where: { id: contactId },
    });
  }
}