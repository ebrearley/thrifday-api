import { WoolworthsProductDto } from './woolworths-product.dto';

export class WoolworthsProductSearchResponseDto {
  Products: [
    {
      Name: string;
      Products: WoolworthsProductDto[];
    },
  ];
}
