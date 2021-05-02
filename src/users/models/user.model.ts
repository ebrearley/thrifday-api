import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@users/entities/user.entity';
import { IsEmail } from 'class-validator';

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  @IsEmail()
  email: string;

  static fromUserEntity(userEntity: UserEntity): UserModel {
    return {
      id: userEntity.id,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      email: userEntity.email,
    };
  }
}
