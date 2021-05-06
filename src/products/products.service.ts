import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { RetailersService } from '@retailers/retailers.service';
import { UserModel } from '@users/models/user.model';
import { sortBy, last, map } from 'lodash';
import { Repository } from 'typeorm';
import { MonitoredProductEntity } from './entities/monitored-product.entity';
import { ProductPriceEntity } from './entities/product-price.entity';
import { CreateMonitoredProductInput } from './inputs/create-monitored-product.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(MonitoredProductEntity)
    private readonly monitoredProductRepository: Repository<MonitoredProductEntity>,

    @InjectRepository(ProductPriceEntity)
    private readonly productPriceRepository: Repository<ProductPriceEntity>,

    @InjectRepository(RetailerProductEntity)
    private readonly retailerProductRepository: Repository<RetailerProductEntity>,

    private readonly retailersService: RetailersService,
  ) {}
  async findMonitoredProductsByUserId(userId: string) {
    const monitoredProducts = await this.monitoredProductRepository.find({
      where: { userId },
    });

    return monitoredProducts;
  }

  async create(
    createMonitoredProductInput: CreateMonitoredProductInput,
    user: UserModel,
  ) {
    const products = await Promise.all(
      map(createMonitoredProductInput.productPages, async (productPage) => {
        const productDetails = await this.retailersService.getProductDetails(
          productPage.url,
          productPage.retailer,
        );

        return productDetails;
      }),
    );

    const name = last(sortBy(products, 'reatailer')).name;
    const retailerProducts = map(
      products,
      RetailerProductEntity.fromRetailerProductModel,
    );

    const createdMonitoredProduct = await this.monitoredProductRepository.create(
      {
        user,
        name,
        retailerProducts,
      },
    );

    return this.monitoredProductRepository.save(createdMonitoredProduct);
  }
}
