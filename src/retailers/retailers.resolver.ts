import { Args, Query, Resolver } from '@nestjs/graphql';
import { RetailerProductSearchTermInput } from './inputs/product-search-term.input';
import { ProductModel } from './models/product.model';
import { WoolworthsService } from './woolworths/woolworths.service';
import { ColesService } from './coles/coles.service';
import { flatten, values } from 'lodash';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';

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
    const searchServices = {
      [RetailerEnum.Woolworths]: this.woolworthsService.getProductsBySearchTerm(
        input.searchTerm,
      ),
      [RetailerEnum.Coles]: this.colesService.getProductsBySearchTerm(
        input.searchTerm,
      ),
    };

    if (input.retailer) {
      const searchService = searchServices[input.retailer];
      const results = await searchService;
      return results;
    }

    const allResults = await Promise.all(values(searchServices));
    return flatten(allResults);
  }
}
