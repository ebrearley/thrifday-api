import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { UserEntity } from '@users/entities/user.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('monitored_product')
export class MonitoredProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relationships:

  @OneToMany(
    (type) => RetailerProductEntity,
    (retailerProduct) => retailerProduct.product,
  )
  retailerProducts: RetailerProductEntity[];

  @ManyToOne((type) => UserEntity, (user) => user.products)
  user: UserEntity;
}
