import { Field, ID, InputType } from '@nestjs/graphql';

import { ProductPageInput } from './product-page.input';

@InputType()
export class AddProductPageToMonitoredProductInput {
  @Field(() => ID)
  monitoredProductId: string;

  @Field(() => [ProductPageInput])
  productPages: ProductPageInput[];
}
