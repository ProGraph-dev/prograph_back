import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  ISO: string;

  @Column({ type: 'varchar' })
  path: string;
}
