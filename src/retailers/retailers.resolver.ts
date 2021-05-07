import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductPageInput } from '@products/inputs/product-page.input';
import { RetailerProductModel } from '@retailers/models/retailer-product.model';
import { map } from 'lodash';
import { RetailerEnum } from './@enums/retailer.enum';
import { RetailerProductSearchTermInput } from './inputs/product-search-term.input';
import { RetailersService } from './retailers.service';

@Resolver()
export class RetailersResolver {
  constructor(private readonly retailersService: RetailersService) {}

  @Query(() => [RetailerProductModel], { name: 'products', defaultValue: [] })
  async products(
    @Args({ name: 'input', type: () => RetailerProductSearchTermInput })
    input: RetailerProductSearchTermInput,
  ) {
    const productDtos = await this.retailersService.searchForProducts(
      input.searchTerm,
      input.retailers,
    );

    return map(productDtos, RetailerProductModel.fromProductDto);
  }

  @Query(() => RetailerProductModel, { nullable: true })
  async retailerProduct(
    @Args({ name: 'input', type: () => ProductPageInput })
    input: ProductPageInput,
  ) {
    const productDetails = await this.retailersService.getProductDetails(
      input.url,
      input.retailer,
    );

    return productDetails;
  }
}
