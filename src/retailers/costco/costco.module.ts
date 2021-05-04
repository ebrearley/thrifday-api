import { HttpModule, Module } from '@nestjs/common';
import { CostcoService } from './costco.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  providers: [CostcoService],
  exports: [CostcoService],
})
export class CostcoModule {}
