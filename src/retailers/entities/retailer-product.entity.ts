import { MonitoredProductEntity } from '@products/entities/monitored-product.entity';
import { ProductPriceEntity } from '@products/entities/product-price.entity';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('retailer_product')
export class RetailerProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  imageUrl: string;

  @Column()
  unitPrice: string;

  @Column({
    type: 'enum',
    enum: RetailerEnum,
  })
  retailer: RetailerEnum;

  // Relationships:

  @OneToOne(
    (type) => ProductPriceEntity,
    (productPrice) => productPrice.retailerProduct,
  )
  price: ProductPriceEntity;

  @OneToMany(
    (type) => ProductPriceEntity,
    (productPrice) => productPrice.retailerProduct,
  )
  priceHistory: ProductPriceEntity[];

  @ManyToOne(
    (type) => MonitoredProductEntity,
    (monitoredProduct) => monitoredProduct.retailerProducts,
  )
  product: ProductPriceEntity;
}
