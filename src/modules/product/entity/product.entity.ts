import { ProductType } from 'src/modules/product-type/entity/product-type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public title: string;

  @Column({ type: 'varchar' })
  public url: string;

  @Column({ type: 'integer' })
  public price: number;

  @Column({ type: 'varchar', default: 'EN' })
  public ISO: string;

  @JoinColumn({ name: 'productTypeId' })
  @ManyToOne(() => ProductType, (productType) => productType.product)
  public productType: ProductType;
}
