import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateAchievementDTO {
  @IsString()
  title: string;

  @IsNumber()
  count: number;

  @IsBoolean()
  is_active: boolean;
}

export class UpdateAchievementDTO {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsNumber()
  count: number;

  @IsBoolean()
  is_active: boolean;
}
