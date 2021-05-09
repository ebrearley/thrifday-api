import { Field, InputType } from '@nestjs/graphql';

import { RetailerEnum } from '@retailers/@enums/retailer.enum';

@InputType()
export class ProductPageInput {
  @Field()
  url: string;

  @Field(() => RetailerEnum)
  retailer: RetailerEnum;
}
