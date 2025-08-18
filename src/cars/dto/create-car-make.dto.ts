import { IsString } from 'class-validator';

export class CreateCarMakeDto {
  @IsString()
  name: string;
}
