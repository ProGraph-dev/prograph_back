import { IsNumber } from 'class-validator';

export class CreateChatDTO {
  @IsNumber()
  project_id: number;
}
