import { Field, ObjectType } from '@nestjs/graphql';
import { UserModel } from '@users/models/user.model';

@ObjectType('TokenUser')
export class TokenUserModel {
  @Field()
  token: string;

  @Field()
  user: UserModel;
}
