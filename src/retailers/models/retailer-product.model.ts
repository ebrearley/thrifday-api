import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProductDto } from '@products/dtos/product.dto';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';
import { v5 as uuidv5 } from 'uuid';
import { DateTime, Duration } from 'luxon';
import { ProductPriceModel } from '@products/models/product-price.model';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { orderBy, head, at, nth, compact, isEmpty } from 'lodash';

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
  retailer: RetailerEnum;

  @Field({ nullable: true })
  isUnavailable?: boolean;

  @Field({ nullable: true })
  isOnSpecial?: boolean;

  @Field((type) => [ProductPriceModel], { nullable: true })
  prices?: ProductPriceModel[];

  @Field((type) => ProductPriceModel, { nullable: true })
  latestPrice?: ProductPriceModel;

  @Field((type) => ProductPriceModel, { nullable: true })
  previousPrice?: ProductPriceModel;

  static fromRetailerProductEntity(
    retailerProductEntity: RetailerProductEntity,
  ): RetailerProductModel {
    const pricesOrderedByDate = orderBy(
      retailerProductEntity.prices,
      ['observedAtDateTime'],
      ['desc'],
    );

    const latestPrice = head(pricesOrderedByDate);
    const previousPrice = nth(pricesOrderedByDate, 1);

    return {
      ...retailerProductEntity,
      latestPrice,
      previousPrice,
      productPageUrl: retailerProductEntity.url,
    };
  }

  static fromProductDto(productDto: ProductDto): RetailerProductModel {
    const productId = uuidv5(productDto.productPageUrl, uuidv5.URL);
    const observedAtDateTime = DateTime.now().toJSDate();
    const priceId = uuidv5(
      `${productDto.productPageUrl}${productDto.price}${observedAtDateTime}`,
      productId,
    );
    const previousPriceId = uuidv5(
      `${productDto.productPageUrl}${productDto.wasPrice}${observedAtDateTime}`,
      productId,
    );

    const price = {
      id: priceId,
      observedAtDateTime,
      value: productDto.price,
    };

    const previousPrice = {
      id: previousPriceId,
      observedAtDateTime: DateTime.fromJSDate(observedAtDateTime)
        .minus({
          days: 1,
        })
        .toJSDate(),
      value: productDto.wasPrice,
    };

    const prices = compact([
      productDto.wasPrice ? previousPrice : null,
      productDto.price ? price : null,
    ]);

    return {
      id: productId,
      brand: productDto.brand,
      name: productDto.name,
      imageUrl: productDto.imageUrl,
      productPageUrl: productDto.productPageUrl,
      retailer: productDto.retailer,
      packageSize: productDto.packageSize,
      unitPrice: productDto.unitPrice,
      prices: !isEmpty(prices) ? prices : null,
      latestPrice: productDto.price ? price : null,
      previousPrice: productDto.wasPrice ? previousPrice : null,
      isUnavailable: productDto.price ? null : true,
      isOnSpecial: productDto.isOnSpecial,
    };
  }
}
