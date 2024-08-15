import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('achievement')
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'integer' })
  count: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
