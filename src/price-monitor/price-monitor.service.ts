import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MonitoredProductEntity } from '@products/entities/monitored-product.entity';
import { ProductsService } from '@products/products.service';
import { Repository } from 'typeorm';

@Injectable()
export class PriceMonitorService {
  constructor(
    @InjectRepository(MonitoredProductEntity)
    private readonly monitoredProductRepository: Repository<MonitoredProductEntity>,

    private readonly productsService: ProductsService,
  ) {}

  // getPriceByProduct() {}
}
