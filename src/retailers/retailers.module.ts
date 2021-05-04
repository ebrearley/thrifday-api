import { Module } from '@nestjs/common';
import { RetailersService } from './retailers.service';
import { RetailersResolver } from './retailers.resolver';
import { WoolworthsModule } from './woolworths/woolworths.module';
import { ColesModule } from './coles/coles.module';
import { CostcoModule } from './costco/costco.module';

@Module({
  providers: [RetailersService, RetailersResolver],
  imports: [WoolworthsModule, ColesModule, CostcoModule],
})
export class RetailersModule {}
