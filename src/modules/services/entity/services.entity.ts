import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entity/user.entity';

@Entity('services')
export class Services {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 100 })
  public title: string;

  @Column({ type: 'varchar', length: 255 })
  public firstImg: string;

  @Column({ type: 'varchar', length: 255 })
  public img: string;

  @Column({ type: 'varchar', default: 'EN', length: 3 })
  public ISO: string;

  @ManyToMany(() => User, (user) => user.likedService)
  @JoinTable({ name: 'user_like_service' })
  public liker: User[];

  @ManyToMany(() => User, (user) => user.viewedService)
  @JoinTable({ name: 'user_view_service' })
  public viewer: User[];

  @ManyToOne(() => User, (user) => user.service)
  @JoinColumn({ name: 'creatorId' })
  public creator: User;

  @Column({ type: 'integer', length: 2, default: 1 })
  public status: number;
}
