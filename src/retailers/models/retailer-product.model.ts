import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProductDto } from '@products/dtos/product.dto';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';
import { v5 as uuidv5 } from 'uuid';
import { DateTime } from 'luxon';
import { ProductPriceModel } from '@products/models/product-price.model';

@ObjectType('RetailerProduct')
export class RetailerProductModel {
  @Field((type) => ID)
  id: string;

  @Field({ nullable: true })
  brand?: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  productPageUrl: string;

  @Field({ nullable: true })
  unitPrice?: string;

  @Field({ nullable: true })
  packageSize?: string;

  @Field((type) => RetailerEnum)
  reatailer: RetailerEnum;

  @Field((type) => [ProductPriceModel])
  prices: ProductPriceModel[];

  static fromProductDto(productDto: ProductDto): RetailerProductModel {
    const productId = uuidv5(productDto.productPageUrl, uuidv5.URL);
    const priceId = uuidv5(
      `${productDto.productPageUrl}${productDto.price}`,
      productId,
    );

    return {
      id: productId,
      brand: productDto.brand,
      name: productDto.name,
      imageUrl: productDto.imageUrl,
      productPageUrl: productDto.productPageUrl,
      reatailer: productDto.reatailer,
      packageSize: productDto.packageSize,
      unitPrice: productDto.unitPrice,
      prices: [
        {
          id: priceId,
          observedAtDateTime: DateTime.now().toJSDate(),
          value: productDto.price,
        },
      ],
    };
  }
}
