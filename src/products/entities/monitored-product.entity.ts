import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { UserEntity } from '@users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('monitored_product')
export class MonitoredProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // Relationships:

  @OneToMany(
    (type) => RetailerProductEntity,
    (retailerProduct) => retailerProduct.monitoredProduct,
    { cascade: ['insert', 'update'] },
  )
  retailerProducts: RetailerProductEntity[];

  @ManyToOne((type) => UserEntity, (user) => user.products)
  user: UserEntity;
}
