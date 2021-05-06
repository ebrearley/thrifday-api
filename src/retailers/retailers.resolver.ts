import { Args, Query, Resolver } from '@nestjs/graphql';
import { RetailerProductSearchTermInput } from './inputs/product-search-term.input';
import { ProductModel } from './models/product.model';
import { RetailersService } from './retailers.service';

@Resolver()
export class RetailersResolver {
  constructor(private readonly retailersService: RetailersService) {}

  @Query(() => [ProductModel], { name: 'products', defaultValue: [] })
  async products(
    @Args({ name: 'input', type: () => RetailerProductSearchTermInput })
    input: RetailerProductSearchTermInput,
  ) {
    return this.retailersService.searchForProducts(
      input.searchTerm,
      input.retailers,
    );
  }
}
