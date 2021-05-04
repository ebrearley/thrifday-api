import { Field, ObjectType } from '@nestjs/graphql';
import { ColesScrapedProductDto } from '@retailers/coles/dtos/coles-scraped-product.dto';
import { WoolworthsProductDto } from '../woolworths/dtos/woolworths-product.dto';

@ObjectType('Product')
export class ProductModel {
  @Field()
  brand: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  productPageUrl: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  unitPrice?: string;

  @Field()
  packageSize: string;

  @Field()
  reatailer: 'Woolworths' | 'Coles';

  static fromWoolworthsProductDto(
    woolworthsProduct: WoolworthsProductDto,
  ): ProductModel {
    return {
      brand: woolworthsProduct.Brand,
      name: woolworthsProduct.Name,
      imageUrl: woolworthsProduct.LargeImageFile,
      productPageUrl: `https://www.woolworths.com.au/shop/productdetails/${woolworthsProduct.Stockcode}/${woolworthsProduct.UrlFriendlyName}`,
      price: woolworthsProduct.Price,
      reatailer: 'Woolworths',
      packageSize: woolworthsProduct.PackageSize,
      unitPrice: `${woolworthsProduct.CupPrice} per ${woolworthsProduct.CupMeasure}`,
    };
  }

  static fromColessProductDto(
    colesProduct: ColesScrapedProductDto,
  ): ProductModel {
    return {
      brand: colesProduct.brand,
      name: colesProduct.name,
      imageUrl: colesProduct.imageUrl,
      productPageUrl: colesProduct.productPageUrl,
      price: colesProduct.price,
      packageSize: colesProduct.packageSize,
      unitPrice: colesProduct.unitPrice,
      reatailer: 'Coles',
    };
  }
}
