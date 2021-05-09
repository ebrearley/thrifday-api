import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoredProductEntity } from '@products/entities/monitored-product.entity';
import { ProductPriceEntity } from '@products/entities/product-price.entity';
import { ProductsModule } from '@products/products.module';
import { RetailerProductEntity } from '@retailers/entities/retailer-product.entity';
import { PriceMonitorService } from './price-monitor.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonitoredProductEntity,
      ProductPriceEntity,
      RetailerProductEntity,
    ]),
    ProductsModule,
  ],
  providers: [PriceMonitorService],
})
export class PriceMonitorModule {}
