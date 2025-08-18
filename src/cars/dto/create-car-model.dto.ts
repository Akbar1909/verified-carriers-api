import { IsInt, IsString } from 'class-validator';

export class CreateCarModelDto {
  @IsString()
  name: string;

  @IsInt()
  makeId: number;
}
