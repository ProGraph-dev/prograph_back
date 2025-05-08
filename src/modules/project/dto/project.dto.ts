import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @IsOptional()
  id?: number;
}

export class CreateProjectDto {
  @IsString()
  title: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  @IsOptional()
  customer?: CustomerDto;
}

export class updateProjectDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;
}
