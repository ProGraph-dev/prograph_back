import { Product } from 'src/modules/product/entity/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => Product, (product) => product.productType)
  public product: Product[];
}
