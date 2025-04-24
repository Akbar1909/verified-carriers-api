import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  salesEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  mcNumber?: string;

  @IsOptional()
  @IsString()
  usdotNumber?: string;

  @IsOptional()
  @IsNumber()
  foundingYear?: number;

  @IsOptional()
  @IsNumber()
  totalEmployees?: number;

  @IsOptional()
  @IsString()
  aboutCompany?: string;

  @IsOptional()
  @IsEmail()
  workEmail?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsArray()
  logoFileIds?: string[]; // Array of file IDs for logos
  
  @IsOptional()
  @IsArray()
  services?: {
    serviceName: string;
    description?: string;
  }[];
  
  @IsOptional()
  @IsArray()
  contactInformation?: {
    phone?: string;
    email?: string;
    officeAddress?: string;
  }[];
}