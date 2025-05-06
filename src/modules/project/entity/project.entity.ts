import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectStatusEnum } from '../enum/project-status.enum';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 100 })
  public title: string;

  @Column({
    type: 'integer',
    default: ProjectStatusEnum.ORDERED,
    enum: ProjectStatusEnum,
  })
  public status: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'customerId' })
  public customer: User;
}
