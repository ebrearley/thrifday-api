import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveProductPagesFromMonitoredProductInput {
  @Field(() => ID)
  monitoredProductId: string;

  @Field(() => [ID])
  productPageIds: string[];
}
