import { RetailerEnum } from '@retailers/@enums/retailer.enum';
import { ColesScrapedProductDto } from '@retailers/coles/dtos/coles-scraped-product.dto';
import { CostcoProductDto } from '@retailers/costco/dtos/costco-product.dto';
import { IgaScrapedProductDto } from '@retailers/iga/dtos/iga-scraped-product.dto';
import { IsDecimal, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { first } from 'lodash';
import { WoolworthsProductDto } from '../../retailers/woolworths/dtos/woolworths-product.dto';

export class ProductDto {
  @IsString()
  brand?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  imageUrl?: string;

  @IsNotEmpty()
  @IsString()
  productPageUrl: string;

  @IsNotEmpty()
  @IsDecimal()
  price: number;

  @IsString()
  unitPrice?: string;

  @IsString()
  packageSize?: string;

  @IsEnum(RetailerEnum)
  retailer: RetailerEnum;

  static fromWoolworthsProductDto(
    woolworthsProduct: WoolworthsProductDto,
  ): ProductDto {
    return {
      brand: woolworthsProduct.Brand,
      name: woolworthsProduct.Name,
      imageUrl: woolworthsProduct.LargeImageFile,
      productPageUrl: `https://www.woolworths.com.au/shop/productdetails/${woolworthsProduct.Stockcode}/${woolworthsProduct.UrlFriendlyName}`,
      price: woolworthsProduct.Price,
      retailer: RetailerEnum.Woolworths,
      packageSize: woolworthsProduct.PackageSize,
      unitPrice: `${woolworthsProduct.CupPrice} per ${woolworthsProduct.CupMeasure}`,
    };
  }

  static fromColesProductDto(colesProduct: ColesScrapedProductDto): ProductDto {
    return {
      brand: colesProduct.brand,
      name: colesProduct.name,
      imageUrl: colesProduct.imageUrl,
      productPageUrl: colesProduct.productPageUrl,
      price: colesProduct.price,
      packageSize: colesProduct.packageSize,
      unitPrice: colesProduct.unitPrice,
      retailer: RetailerEnum.Coles,
    };
  }

  static fromIgaProductDto(igaProduct: IgaScrapedProductDto): ProductDto {
    return {
      brand: igaProduct.brand,
      name: igaProduct.name,
      imageUrl: igaProduct.imageUrl,
      productPageUrl: igaProduct.productPageUrl,
      price: igaProduct.price,
      packageSize: igaProduct.packageSize,
      unitPrice: igaProduct.unitPrice,
      retailer: RetailerEnum.IGA,
    };
  }

  static fromCoscoProductDto(costcoProduct: CostcoProductDto): ProductDto {
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
      retailer: RetailerEnum.Costco,
    };
  }
}
