import { ProductPriceModel } from '@products/models/product-price.model';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { toNumber } from 'lodash';
import {
  AfterLoad,
  Column,
  Entity,
  ManyToOne,
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
    (retailerProduct) => retailerProduct.prices,
    { onDelete: 'CASCADE' },
  )
  retailerProduct: RetailerProductEntity;

  @AfterLoad() _convertNumerics() {
    // 64 bits truncated to 53 is fine in my case
    this.value = parseFloat(this.value as any);
  }

  static fromProductPriceModel(
    productPriceModel: ProductPriceModel,
  ): Partial<ProductPriceEntity> {
    return {
      observedAtDateTime: productPriceModel.observedAtDateTime,
      value: toNumber(productPriceModel.value),
    };
  }
}
