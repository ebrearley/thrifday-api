import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType('ProductPrice')
export class ProductPriceModel {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLISODateTime)
  observedAtDateTime: Date;

  @Field(() => Float)
  value: number;
}
