import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoredProductEntity } from '@products/entities/monitored-product.entity';
import { ProductPriceEntity } from '@products/entities/product-price.entity';
import { ProductsModule } from '@products/products.module';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { RetailersModule } from '@retailers/retailers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitoredProductEntity,
      ProductPriceEntity,
      RetailerProductEntity,
    ]),
    ProductsModule,
    RetailersModule,
  ],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
