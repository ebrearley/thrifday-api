import { MonitoredProductEntity } from '@products/entities/monitored-product.entity';
import { ProductPriceEntity } from '@products/entities/product-price.entity';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';
import { RetailerProductModel } from '@retailers/models/retailer-product.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartialDeep } from 'type-fest';
import { map } from 'lodash';

@Entity('retailer_product')
export class RetailerProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  unitPrice?: string;

  @Column({ nullable: true })
  packageSize?: string;

  @Column({
    type: 'enum',
    enum: RetailerEnum,
  })
  retailer: RetailerEnum;

  @Column({ nullable: true })
  isUnavailable?: boolean;

  // Relationships:

  @OneToMany(
    (type) => ProductPriceEntity,
    (productPrice) => productPrice.retailerProduct,
    { cascade: ['insert', 'update'] },
  )
  prices: ProductPriceEntity[];

  @ManyToOne(
    (type) => MonitoredProductEntity,
    (monitoredProduct) => monitoredProduct.retailerProducts,
  )
  monitoredProduct: MonitoredProductEntity;

  static fromRetailerProductModel(
    retailerProductModel: RetailerProductModel,
  ): PartialDeep<RetailerProductEntity> {
    return {
      name: retailerProductModel.name,
      url: retailerProductModel.productPageUrl,
      imageUrl: retailerProductModel.imageUrl,
      unitPrice: retailerProductModel.unitPrice,
      retailer: retailerProductModel.retailer,
      brand: retailerProductModel.brand,
      packageSize: retailerProductModel.packageSize,
      prices: retailerProductModel.prices
        ? map(
            retailerProductModel.prices,
            ProductPriceEntity.fromProductPriceModel,
          )
        : [],
      isUnavailable: retailerProductModel.isUnavailable,
    };
  }
}
