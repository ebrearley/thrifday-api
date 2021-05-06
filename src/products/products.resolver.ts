import { CtxUser } from '@auth/decorators/ctx-user.decorator';
import { GqlAuthGuard } from '@auth/guards/gql-guard.guard';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserModel } from '@users/models/user.model';
import { CreateMonitoredProductInput } from './inputs/create-monitored-product.input';
import { MonitoredProductModel } from './models/monitored-product.model';
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
    console.log(monitoredProduct);
    return monitoredProduct;
  }
}
