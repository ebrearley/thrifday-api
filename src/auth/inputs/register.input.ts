import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AuthRegisterInput {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;
}
