import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('RemoveResult')
export class RemoveResultModel {
  @Field(() => ID)
  removedItemWithId: string;

  @Field({ nullable: true })
  errorMessage?: string;

  @Field()
  successfulyRemoved: boolean;
}
