import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class RemoveMonitoredProductInput {
  @Field(() => ID)
  monitoredProductId: string;
}
