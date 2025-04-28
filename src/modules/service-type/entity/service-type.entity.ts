import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('service_type')
export class ServiceType {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', length: 100 })
  public title: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'boolean', default: true, select: false })
  public isActive: boolean;

  @Column({ type: 'varchar', default: 'EN', length: 3, select: false })
  public ISO: string;
}
