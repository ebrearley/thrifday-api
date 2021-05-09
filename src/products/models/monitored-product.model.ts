import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MonitoredProductEntity } from '@products/entities/monitored-product.entity';
import { RetailerProductModel } from '@retailers/models/retailer-product.model';
import { map } from 'lodash';

@ObjectType('MonitoredProduct')
export class MonitoredProductModel {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((type) => [RetailerProductModel])
  retailerProducts: RetailerProductModel[];

  static fromMonitoredrProductEntity(
    monitoredProductEntity: MonitoredProductEntity,
  ): MonitoredProductModel {
    return {
      ...monitoredProductEntity,
      retailerProducts: map(
        monitoredProductEntity.retailerProducts,
        RetailerProductModel.fromRetailerProductEntity,
      ),
    };
  }
}
