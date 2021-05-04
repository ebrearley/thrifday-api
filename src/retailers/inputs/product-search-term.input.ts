import { Field, InputType } from '@nestjs/graphql';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';

@InputType()
export class RetailerProductSearchTermInput {
  @Field()
  searchTerm: string;

  @Field(() => RetailerEnum, { nullable: true })
  retailer?: RetailerEnum;
}
