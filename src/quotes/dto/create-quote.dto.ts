import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsEmail,
  IsNumber,
} from 'class-validator';

export class CreateQuoteDto {
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  subCategory?: string;

  @IsOptional()
  @IsInt()
  carManufactureYear?: number;

  @IsOptional()
  @IsInt()
  carMakeId?: number;

  @IsOptional()
  @IsInt()
  carModelId?: number;

  @IsOptional()
  @IsInt()
  carCondition?: number;

  @IsOptional()
  @IsString()
  vehicleType?: string;

  @IsOptional()
  @IsString()
  pickupId?: string;

  @IsOptional()
  @IsString()
  pickupType?: string;

  @IsOptional()
  @IsString()
  dropoffId?: string;

  @IsOptional()
  @IsString()
  dropoffType?: string;

  @IsOptional()
  @IsDateString()
  estimatedShipDate?: string;

  @IsOptional()
  @IsInt()
  shipViaId?: number;

  @IsInt()
  vehicleRuns: number;

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  companyId?: string;
}
