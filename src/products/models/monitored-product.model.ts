import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RetailerProductModel } from '@retailers/models/retailer-product.model';

@ObjectType('MonitoredProduct')
export class MonitoredProductModel {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((type) => [RetailerProductModel])
  retailerProducts: RetailerProductModel[];
}
