import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MonitoredProductModel } from '@products/models/monitored-product.model';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';
import { UserEntity } from '@users/entities/user.entity';
import { IsEmail } from 'class-validator';

@ObjectType('User')
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => RetailerEnum, { nullable: true })
  temp?: RetailerEnum;

  @Field((type) => [MonitoredProductModel], {
    nullable: true,
    defaultValue: [],
  })
  monitoredProducts?: MonitoredProductModel[];

  static fromUserEntity(userEntity: UserEntity): UserModel {
    const temp: RetailerEnum = RetailerEnum['Woolworths'];
    return {
      id: userEntity.id,
      email: userEntity.email,
      temp,
    };
  }
}
