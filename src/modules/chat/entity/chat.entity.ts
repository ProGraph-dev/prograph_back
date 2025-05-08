import { Project } from 'src/modules/project/entity/project.entity';
import { User } from 'src/modules/user/entity/user.entity';
import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => Project, (project) => project.chat)
  @JoinColumn({ name: 'projectId' })
  public project: Project;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable({ name: 'chat_user' })
  public users: User[];

  @OneToMany(() => Message, (message) => message.chat)
  public messages: Message[];
}
