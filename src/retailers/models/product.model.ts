import { Field, ObjectType } from '@nestjs/graphql';
import { WoolworthsProductDto } from '../woolworths/dtos/woolworths-product.dto';

@ObjectType('Product')
export class ProductModel {
  @Field()
  name: string;

  @Field({ nullable: true })
  iamgeUrl?: string;

  @Field()
  productPageUrl: string;

  @Field()
  price: number;

  @Field()
  packageSize: string;

  @Field()
  reatailer: 'Woolworths' | 'Coles';

  static fromWoolworthsProductDto(
    woolworthsProduct: WoolworthsProductDto,
  ): ProductModel {
    return {
      name: woolworthsProduct.Name,
      iamgeUrl: woolworthsProduct.LargeImageFile,
      productPageUrl: `https://www.woolworths.com.au/shop/productdetails/${woolworthsProduct.Stockcode}/${woolworthsProduct.UrlFriendlyName}`,
      price: woolworthsProduct.Price,
      reatailer: 'Woolworths',
      packageSize: woolworthsProduct.PackageSize,
    };
  }
}
