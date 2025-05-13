import { IsEmail, IsString } from 'class-validator';

export class LogAndRegDTO {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
