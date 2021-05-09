import { Field, InputType } from '@nestjs/graphql';

import { ProductPageInput } from './product-page.input';

@InputType()
export class CreateMonitoredProductInput {
  @Field({ nullable: true }) // If undefined, then determined by one of the product page results
  name?: string;

  @Field(() => [ProductPageInput])
  productPages: ProductPageInput[];
}
