import { UserRoleEnum } from 'src/utils/enums/user-role.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
