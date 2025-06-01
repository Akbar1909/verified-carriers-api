import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceType } from '@prisma/client';

export class CreateServiceDto {
  @IsOptional()
  @IsString()
  serviceLabel?: string;

  @IsEnum(ServiceType)
  serviceName: ServiceType;

  @IsOptional()
  @IsString()
  description?: string;
}
