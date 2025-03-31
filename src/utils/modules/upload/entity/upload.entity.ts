import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public filename: string;

  @Column({ type: 'varchar' })
  public originalname: string;

  @Column({ type: 'varchar' })
  public path: string;

  @Column({ type: 'varchar', length: 10 })
  public encoding: string;

  @Column({ type: 'varchar', length: 100 })
  public mimetype: string;

  @Column({ type: 'varchar', length: 50 })
  public destination: string;

  @Column({ type: 'int' })
  public type: number;

  @Column({ type: 'integer' })
  public size: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public created_at: Date;
}
