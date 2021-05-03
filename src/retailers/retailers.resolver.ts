import { Args, Query, Resolver } from '@nestjs/graphql';
import { RetailerProductSearchTermInput } from './inputs/product-search-term.input';
import { ProductModel } from './models/product.model';
import { WoolworthsService } from './woolworths/woolworths.service';

@Resolver()
export class RetailersResolver {
  constructor(private woolworthsService: WoolworthsService) {}

  @Query(() => [ProductModel], { name: 'products', defaultValue: [] })
  async products(
    @Args({ name: 'input', type: () => RetailerProductSearchTermInput })
    input: RetailerProductSearchTermInput,
  ) {
    const woolworthsProducts = await this.woolworthsService.getProductsBySearchTerm(
      input.searchTerm,
    );

    return woolworthsProducts;
  }
}
