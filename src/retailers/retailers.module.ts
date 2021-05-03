import { Module } from '@nestjs/common';
import { RetailersService } from './retailers.service';
import { RetailersResolver } from './retailers.resolver';
import { WoolworthsModule } from './woolworths/woolworths.module';

@Module({
  providers: [RetailersService, RetailersResolver],
  imports: [WoolworthsModule],
})
export class RetailersModule {}
