import { Args, Query, Resolver } from '@nestjs/graphql';
import { RetailerProductSearchTermInput } from './inputs/product-search-term.input';
import { ProductModel } from './models/product.model';
import { WoolworthsService } from './woolworths/woolworths.service';
import { ColesService } from './coles/coles.service';
import { flatten } from 'lodash';

@Resolver()
export class RetailersResolver {
  constructor(
    private readonly woolworthsService: WoolworthsService,
    private readonly colesService: ColesService,
  ) {}

  @Query(() => [ProductModel], { name: 'products', defaultValue: [] })
  async products(
    @Args({ name: 'input', type: () => RetailerProductSearchTermInput })
    input: RetailerProductSearchTermInput,
  ) {
    const allResults = await Promise.all([
      this.woolworthsService.getProductsBySearchTerm(input.searchTerm),
      this.colesService.getProductsBySearchTerm(input.searchTerm),
    ]);

    return flatten(allResults);
  }
}
