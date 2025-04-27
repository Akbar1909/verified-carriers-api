import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  workEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}