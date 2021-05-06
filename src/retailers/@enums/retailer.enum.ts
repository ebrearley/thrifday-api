import { registerEnumType } from '@nestjs/graphql';

export enum RetailerEnum {
  Coles = 'Coles',
  Woolworths = 'Woolworths',
  Costco = 'Costco',
  IGA = 'IGA',
}

registerEnumType(RetailerEnum, { name: 'Retailer' });
