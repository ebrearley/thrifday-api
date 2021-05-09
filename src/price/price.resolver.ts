import { Query, Resolver } from '@nestjs/graphql';
import { RetailerProductModel } from '@retailers/models/retailer-product.model';
import { map } from 'lodash';
import { PriceService } from './price.service';

@Resolver()
export class PriceResolver {
  constructor(private readonly priceService: PriceService) {}

  @Query(() => [RetailerProductModel], { nullable: true })
  async temp() {
    const retailerProducts = await this.priceService.updateForAllProducts();
    return map(
      retailerProducts,
      RetailerProductModel.fromRetailerProductEntity,
    );
  }
}
