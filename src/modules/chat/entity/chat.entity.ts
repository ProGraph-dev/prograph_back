import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  public id: number;
}
