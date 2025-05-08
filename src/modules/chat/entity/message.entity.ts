import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatTypeEnum } from '../enum/chat-type.enum';
import { Chat } from './chat.entity';
import { User } from 'src/modules/user/entity/user.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'smallint', enum: ChatTypeEnum, default: ChatTypeEnum.TEXT })
  public type: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  public url: string;

  @Column({ type: 'text', nullable: true })
  public text: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @ManyToOne(() => Chat, (chat) => chat.messages)
  @JoinColumn({ name: 'chatId' })
  public chat: Chat;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'senderId' })
  public sender: User;

  @ManyToMany(() => User, (user) => user.readedMesages)
  @JoinTable({ name: 'user_readed_mesages' })
  public readers: User[];
}
