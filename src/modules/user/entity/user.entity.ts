import { Chat } from 'src/modules/chat/entity/chat.entity';
import { Message } from 'src/modules/chat/entity/message.entity';
import { Employee } from 'src/modules/employee/entity/employee.entity';
import { Profession } from 'src/modules/proffesion/entity/profession.entity';
import { Project } from 'src/modules/project/entity/project.entity';
import { Services } from 'src/modules/services/entity/services.entity';
import { UserRoleEnum } from 'src/utils/enums/user-role.enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'integer', enum: UserRoleEnum, default: UserRoleEnum.USER })
  userRole: number;

  @Column({ type: 'varchar', select: false })
  password: string;

  @ManyToMany(() => Profession, { onDelete: 'SET NULL' })
  profession: Profession[];

  @OneToOne(() => Employee)
  employeeDesc: Employee;

  @ManyToMany(() => Services, (services) => services.viewer)
  @JoinTable({ name: 'user_view_service' })
  public viewedService: Services[];

  @ManyToMany(() => Services, (services) => services.liker)
  @JoinTable({ name: 'user_like_service' })
  public likedService: Services[];

  @OneToMany(() => Services, (serv) => serv.creator)
  public service: Services[];

  @OneToMany(() => Project, (project) => project.customer)
  public projects: Project[];

  @ManyToMany(() => Chat, (chat) => chat.users)
  @JoinTable({ name: 'chat_user' })
  public chats: Chat[];

  @OneToMany(() => Message, (message) => message.sender)
  public messages: Message[];

  @ManyToMany(() => Message, (message) => message.readers)
  @JoinTable({ name: 'user_readed_mesages' })
  public readedMesages: Message[];
}
