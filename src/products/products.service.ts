import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { RetailersService } from '@retailers/retailers.service';
import { UserModel } from '@users/models/user.model';
import { sortBy, last, map } from 'lodash';
import { Repository } from 'typeorm';
import { MonitoredProductEntity } from './entities/monitored-product.entity';
import { CreateMonitoredProductInput } from './inputs/create-monitored-product.input';
import { MonitoredProductModel } from './models/monitored-product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(MonitoredProductEntity)
    private readonly monitoredProductRepository: Repository<MonitoredProductEntity>,
    private readonly retailersService: RetailersService,
  ) {}
  async findMonitoredProductsByUserId(userId: string) {
    const monitoredProducts = await this.monitoredProductRepository.find({
      relations: ['user', 'retailerProducts', 'retailerProducts.prices'],
      join: {
        alias: 'monitoredProduct',
        leftJoinAndSelect: {
          retailerProducts: 'monitoredProduct.retailerProducts',
          prices: 'retailerProducts.prices',
        },
      },
      where: { user: { id: userId } },
    });

    return map(
      monitoredProducts,
      MonitoredProductModel.fromMonitoredrProductEntity,
    );
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

    const name = last(sortBy(products, 'retailer')).name;
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

    const monitoredProductEntity = await this.monitoredProductRepository.save(
      createdMonitoredProduct,
    );

    return MonitoredProductModel.fromMonitoredrProductEntity(
      monitoredProductEntity,
    );
  }
}
