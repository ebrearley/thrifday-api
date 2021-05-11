import { Injectable } from '@nestjs/common';
import { PriceService } from 'src/price/price.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PriceMonitorService {
  constructor(private readonly priceService: PriceService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async checkAndUpdatePrices() {
    await this.priceService.UpdatePriceForAllProducts();
  }
}
