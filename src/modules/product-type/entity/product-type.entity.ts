import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_type')
export class ProductType {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public title: string;

  @Column({ type: 'boolean', default: true })
  public visible: boolean;

  @Column({ type: 'varchar', default: 'EN' })
  public ISO: string;
}
