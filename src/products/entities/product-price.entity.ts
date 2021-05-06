import { ProductPriceModel } from '@products/models/product-price.model';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product_price')
export class ProductPriceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamptz')
  observedAtDateTime: Date;

  @Column('decimal')
  value: number;

  // Relationships:

  @ManyToOne(
    (type) => RetailerProductEntity,
    (retailerProduct) => retailerProduct.priceHistory,
  )
  @OneToOne(
    (type) => RetailerProductEntity,
    (retailerProduct) => retailerProduct.price,
  )
  retailerProduct: RetailerProductEntity;

  static fromProductPriceModel(
    productPriceModel: ProductPriceModel,
  ): Partial<ProductPriceEntity> {
    return {
      observedAtDateTime: productPriceModel.observedAtDateTime,
      value: productPriceModel.value,
    };
  }
}
