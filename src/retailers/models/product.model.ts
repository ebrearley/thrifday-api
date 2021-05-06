import { Field, ObjectType } from '@nestjs/graphql';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';
import { ColesScrapedProductDto } from '@retailers/coles/dtos/coles-scraped-product.dto';
import { CostcoProductDto } from '@retailers/costco/dtos/costco-product.dto';
import { IgaScrapedProductDto } from '@retailers/iga/dtos/iga-scraped-product.dto';
import { first } from 'lodash';
import { WoolworthsProductDto } from '../woolworths/dtos/woolworths-product.dto';

@ObjectType('Product')
export class ProductModel {
  @Field({ nullable: true })
  brand?: string;

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
  reatailer: RetailerEnum;

  static fromWoolworthsProductDto(
    woolworthsProduct: WoolworthsProductDto,
  ): ProductModel {
    return {
      brand: woolworthsProduct.Brand,
      name: woolworthsProduct.Name,
      imageUrl: woolworthsProduct.LargeImageFile,
      productPageUrl: `https://www.woolworths.com.au/shop/productdetails/${woolworthsProduct.Stockcode}/${woolworthsProduct.UrlFriendlyName}`,
      price: woolworthsProduct.Price,
      reatailer: RetailerEnum.Woolworths,
      packageSize: woolworthsProduct.PackageSize,
      unitPrice: `${woolworthsProduct.CupPrice} per ${woolworthsProduct.CupMeasure}`,
    };
  }

  static fromColesProductDto(
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
      reatailer: RetailerEnum.Coles,
    };
  }

  static fromIgaProductDto(igaProduct: IgaScrapedProductDto): ProductModel {
    return {
      brand: igaProduct.brand,
      name: igaProduct.name,
      imageUrl: igaProduct.imageUrl,
      productPageUrl: igaProduct.productPageUrl,
      price: igaProduct.price,
      packageSize: igaProduct.packageSize,
      unitPrice: igaProduct.unitPrice,
      reatailer: RetailerEnum.IGA,
    };
  }

  static fromCoscoProductDto(costcoProduct: CostcoProductDto): ProductModel {
    return {
      name: costcoProduct.name,
      imageUrl: first(costcoProduct.images)?.url
        ? `https://www.costco.com.au${first(costcoProduct.images)?.url}`
        : undefined,
      productPageUrl: `https://www.costco.com.au${costcoProduct.url}`,
      price: costcoProduct.price?.value || 0,
      packageSize: '',
      unitPrice: costcoProduct.pricePerUnit?.value
        ? `${costcoProduct.pricePerUnit?.value} per ${costcoProduct.unitType}`
        : null,
      reatailer: RetailerEnum.Costco,
    };
  }
}
