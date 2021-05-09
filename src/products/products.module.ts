import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { MonitoredProductEntity } from './entities/monitored-product.entity';
import { ProductPriceEntity } from './entities/product-price.entity';
import { RetailersModule } from '@retailers/retailers.module';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitoredProductEntity,
      ProductPriceEntity,
      RetailerProductEntity,
    ]),
    RetailersModule,
  ],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService],
})
export class ProductsModule {}
