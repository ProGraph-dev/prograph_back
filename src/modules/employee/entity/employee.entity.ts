import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  photo: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', default: 'EN' })
  ISO: string;
}
