import { CtxUser } from '@auth/decorators/ctx-user.decorator';
import { GqlAuthGuard } from '@auth/guards/gql-guard.guard';
import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductsService } from '@products/products.service';
import { UserModel } from './models/user.model';

@Resolver()
export class UsersResolver {
  // constructor(private readonly productService: ProductsService) {}

  @Query(() => UserModel, { nullable: true })
  @UseGuards(GqlAuthGuard)
  currentUser(@CtxUser() user: UserModel) {
    return user;
  }

  // @ResolveField()
  // async monitoredProducts(@Parent() user: UserModel) {
  //   const monitoredProducts = await this.productService.findMonitoredProductsByUserId(
  //     user.id,
  //   );

  //   return monitoredProducts;
  // }
}
