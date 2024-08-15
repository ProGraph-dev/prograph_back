import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('socials')
export class Socials {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  icon: string;

  @Column({ type: 'varchar' })
  link: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', default: 'EN' })
  ISO: string;
}
