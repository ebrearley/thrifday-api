import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RetailerProductSearchTermInput {
  @Field()
  searchTerm: string;
}
