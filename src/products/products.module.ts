import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { MonitoredProductEntity } from './entities/monitored-product.entity';
import { ProductPriceEntity } from './entities/product-price.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MonitoredProductEntity, ProductPriceEntity]),
  ],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsModule],
})
export class ProductsModule {}
