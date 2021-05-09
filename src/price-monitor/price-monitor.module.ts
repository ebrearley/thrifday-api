import { Module } from '@nestjs/common';
import { PriceModule } from 'src/price/price.module';
import { PriceMonitorService } from './price-monitor.service';

@Module({
  imports: [PriceModule],
  providers: [PriceMonitorService],
})
export class PriceMonitorModule {}
