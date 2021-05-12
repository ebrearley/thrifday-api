import { CtxUser } from '@auth/decorators/ctx-user.decorator';
import { GqlAuthGuard } from '@auth/guards/gql-guard.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserModel } from '@users/models/user.model';
import { AddProductPageToMonitoredProductInput } from './inputs/add-retailer-product-to-monitored-product.input';
import { CreateMonitoredProductInput } from './inputs/create-monitored-product.input';
import { RemoveMonitoredProductInput } from './inputs/remove-monitored-product.input';
import { RemoveProductPagesFromMonitoredProductInput } from './inputs/remove-product-pages-from-monitored-product.input';
import { MonitoredProductModel } from './models/monitored-product.model';
import { RemoveResultModel } from './models/remove-result.input';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => MonitoredProductModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async addMonitoredProduct(
    @CtxUser() user: UserModel,
    @Args({ name: 'input', type: () => CreateMonitoredProductInput })
    input: CreateMonitoredProductInput,
  ) {
    if (!user) {
      return null;
    }
    const monitoredProduct = await this.productsService.create(input, user);
    return monitoredProduct;
  }

  @Mutation(() => RemoveResultModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeMonitoredProduct(
    @CtxUser() user: UserModel,
    @Args({ name: 'input', type: () => RemoveMonitoredProductInput })
    input: RemoveMonitoredProductInput,
  ) {
    if (!user) {
      return null;
    }
    const removeResult = await this.productsService.remove(input);
    return removeResult;
  }

  @Mutation(() => MonitoredProductModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async addProductPageToMonitoredProduct(
    @CtxUser() user: UserModel,
    @Args({ name: 'input', type: () => AddProductPageToMonitoredProductInput })
    input: AddProductPageToMonitoredProductInput,
  ) {
    if (!user) {
      return null;
    }
    const monitoredProduct = await this.productsService.addProductPageToMonitoredProduct(
      input,
    );
    return monitoredProduct;
  }

  @Mutation(() => MonitoredProductModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async removeProductPageFromMonitoredProduct(
    @CtxUser() user: UserModel,
    @Args({
      name: 'input',
      type: () => RemoveProductPagesFromMonitoredProductInput,
    })
    input: RemoveProductPagesFromMonitoredProductInput,
  ) {
    if (!user) {
      return null;
    }
    const monitoredProduct = await this.productsService.removeProductPageFromMonitoredProduct(
      input,
    );
    return monitoredProduct;
  }
}
