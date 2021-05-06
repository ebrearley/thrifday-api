import { Field, ID, ObjectType, Resolver } from '@nestjs/graphql';
import { MonitoredProductModel } from '@products/models/monitored-product.model';
import { UserEntity } from '@users/entities/user.entity';
import { IsEmail } from 'class-validator';

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field((type) => [MonitoredProductModel], {
    nullable: true,
    defaultValue: [],
  })
  monitoredProducts?: MonitoredProductModel[];

  static fromUserEntity(userEntity: UserEntity): UserModel {
    return {
      id: userEntity.id,
      email: userEntity.email,
    };
  }
}
