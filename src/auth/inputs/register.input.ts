import { Field, InputType } from '@nestjs/graphql';
import { AuthLoginInput } from './login.input';

@InputType()
export class AuthRegisterInput extends AuthLoginInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
