import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RetailerEnum } from '@retailers/@enums/retailer.enum';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { RetailersService } from '@retailers/retailers.service';
import { UserModel } from '@users/models/user.model';
import { sortBy, last, map, reject, includes, forEach } from 'lodash';
import { Repository } from 'typeorm';
import { RetailerProductLoadOptionsArgs } from './@types/retailer-product-load-options-args.type';
import { MonitoredProductEntity } from './entities/monitored-product.entity';
import { AddProductPageToMonitoredProductInput } from './inputs/add-retailer-product-to-monitored-product.input';
import { CreateMonitoredProductInput } from './inputs/create-monitored-product.input';
import { ProductPageInput } from './inputs/product-page.input';
import { RemoveProductPagesFromMonitoredProductInput } from './inputs/remove-product-pages-from-monitored-product.input';
import { MonitoredProductModel } from './models/monitored-product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(MonitoredProductEntity)
    private readonly monitoredProductRepository: Repository<MonitoredProductEntity>,

    @InjectRepository(RetailerProductEntity)
    private readonly retailerProductRepository: Repository<RetailerProductEntity>,

    private readonly retailersService: RetailersService,
  ) {}
  async findMonitoredProductsByUserId(userId: string) {
    const monitoredProducts = await this.monitoredProductRepository.find({
      ...this.getMonitoredProductLoadOptions(),
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
    const products = await this.getProductDetailsFromProductPages(
      createMonitoredProductInput.productPages,
    );

    const name =
      createMonitoredProductInput.name ||
      last(sortBy(products, 'retailer')).name;
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

  async addProductPageToMonitoredProduct(
    input: AddProductPageToMonitoredProductInput,
  ) {
    const monitoredProductEntity = await this.monitoredProductRepository.findOne(
      input.monitoredProductId,
      this.getMonitoredProductLoadOptions(),
    );

    const existingProductPageUrls = map(
      monitoredProductEntity.retailerProducts,
      'url',
    );

    const filteredProductPages = reject(input.productPages, (productPage) =>
      includes(existingProductPageUrls, productPage.url),
    );

    if (!filteredProductPages) {
      return MonitoredProductModel.fromMonitoredrProductEntity(
        monitoredProductEntity,
      );
    }

    const products = await this.getProductDetailsFromProductPages(
      filteredProductPages,
    );

    forEach(products, (product) => {
      monitoredProductEntity.retailerProducts.push(
        RetailerProductEntity.fromRetailerProductModel(
          product,
        ) as RetailerProductEntity,
      );
    });

    const updatedMonitoredProductEntity = await this.monitoredProductRepository.save(
      monitoredProductEntity,
    );

    return MonitoredProductModel.fromMonitoredrProductEntity(
      updatedMonitoredProductEntity,
    );
  }

  async removeProductPageFromMonitoredProduct(
    input: RemoveProductPagesFromMonitoredProductInput,
  ) {
    const monitoredProductEntity = await this.monitoredProductRepository.findOne(
      input.monitoredProductId,
      this.getMonitoredProductLoadOptions(),
    );

    monitoredProductEntity.retailerProducts = reject(
      monitoredProductEntity.retailerProducts,
      (retailerProduct) => includes(input.productPageIds, retailerProduct.id),
    );

    const updatedMonitoredProductEntity = await this.monitoredProductRepository.save(
      monitoredProductEntity,
    );

    return MonitoredProductModel.fromMonitoredrProductEntity(
      updatedMonitoredProductEntity,
    );
  }

  getMonitoredProductLoadOptions() {
    return {
      relations: ['user', 'retailerProducts', 'retailerProducts.prices'],
      join: {
        alias: 'monitoredProduct',
        leftJoinAndSelect: {
          retailerProducts: 'monitoredProduct.retailerProducts',
          prices: 'retailerProducts.prices',
        },
      },
    };
  }

  getRetailerProductLoadOptions(args?: RetailerProductLoadOptionsArgs) {
    const relations = ['prices'];
    const leftJoinAndSelect: {
      prices: string;
      monitoredProduct?: string;
      user?: string;
    } = {
      prices: 'retailerProduct.prices',
    };

    if (args?.includeUser) {
      relations.push('monitoredProduct');
      relations.push('monitoredProduct.user');
      leftJoinAndSelect.monitoredProduct = 'retailerProduct.monitoredProduct';
      leftJoinAndSelect.user = 'monitoredProduct.user';
    }

    return {
      relations,
      join: {
        alias: 'retailerProduct',
        leftJoinAndSelect,
      },
    };
  }

  private async getProductDetailsFromProductPages(
    productPages: ProductPageInput[],
  ) {
    const products = await Promise.all(
      map(productPages, async (productPage) => {
        const productDetails = await this.retailersService.getProductDetails(
          productPage.url,
          productPage.retailer,
        );

        return productDetails;
      }),
    );

    return products;
  }
}
