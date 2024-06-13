import { Employee } from 'src/modules/employee/entity/employee.entity';
import { Profession } from 'src/modules/proffesion/entity/profession.entity';
import { UserRoleEnum } from 'src/utils/enums/user-role.enum';
import {
  Column,
  Entity,
  ManyToMany,
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

  @Column({ type: 'integer', default: UserRoleEnum.USER })
  userRole: number;

  @Column({ type: 'varchar', select: false })
  password: string;

  @ManyToMany(() => Profession, { onDelete: 'SET NULL' })
  profession: Profession[];

  @OneToOne(() => Employee)
  employeeDesc: Employee;
}
