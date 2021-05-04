import { registerEnumType } from '@nestjs/graphql';

export enum RetailerEnum {
  Coles = 'Coles',
  Woolworths = 'Woolworths',
  Costco = 'Costco',
}

registerEnumType(RetailerEnum, { name: 'Retailer' });
