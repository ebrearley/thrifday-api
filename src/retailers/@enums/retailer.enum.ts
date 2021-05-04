import { registerEnumType } from '@nestjs/graphql';

export enum RetailerEnum {
  Coles = 'Coles',
  Woolworths = 'Woolworths',
}

registerEnumType(RetailerEnum, { name: 'Retailer' });
