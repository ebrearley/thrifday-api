import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductPriceEntity } from '@products/entities/product-price.entity';
import { ProductsService } from '@products/products.service';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { RetailerProductModel } from '@retailers/models/retailer-product.model';
import { RetailersService } from '@retailers/retailers.service';
import { compact, find, first, flatten, last, map, orderBy } from 'lodash';
import { Not, IsNull, Repository } from 'typeorm';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(RetailerProductEntity)
    private readonly retailerProductRepository: Repository<RetailerProductEntity>,

    private readonly productsService: ProductsService,
    private readonly retailersService: RetailersService,
  ) {}

  async updateForAllProducts() {
    const products = await this.retailerProductRepository.find({
      where: {
        monitoredProduct: Not(IsNull()),
      },
      ...this.productsService.getRetailerProductLoadOptions(),
    });

    const updatedProducts = await Promise.all(
      map(products, async (product) => {
        const productDetails = await this.retailersService.getProductDetails(
          product.url,
          product.retailer,
        );

        const updatedProduct = await this.addPriceIfDifferent(
          product,
          productDetails,
        );

        return updatedProduct;
      }),
    );

    const mergedProducts = map(products, (product) => {
      const updatedProduct = find(updatedProducts, { id: product.id });
      if (updatedProduct) {
        return updatedProduct;
      }

      return product;
    });

    return mergedProducts;
  }

  private async addPriceIfDifferent(
    existingProduct: RetailerProductEntity,
    newProductDetails: RetailerProductModel,
  ): Promise<RetailerProductEntity | null> {
    if (!newProductDetails.prices) {
      if (existingProduct.isUnavailable) {
        return null;
      }

      const updatedProduct = await this.retailerProductRepository.save({
        ...existingProduct,
        isUnavailable: true,
      });

      return updatedProduct;
    }

    const pricesByDate = orderBy(
      existingProduct.prices,
      ['observedAtDateTime'],
      ['asc'],
    );

    const previousPrice = last(pricesByDate);
    const currentPrice = ProductPriceEntity.fromProductPriceModel(
      first(newProductDetails.prices),
    );

    if (currentPrice.value !== previousPrice?.value) {
      const prices = compact(
        flatten([...existingProduct.prices, currentPrice]),
      );

      const updatedProduct = await this.retailerProductRepository.save({
        ...existingProduct,
        prices,
      });

      return updatedProduct;
    }

    return null;
  }
}
