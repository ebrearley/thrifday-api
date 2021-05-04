import { Module } from '@nestjs/common';
import { RetailersService } from './retailers.service';
import { RetailersResolver } from './retailers.resolver';
import { WoolworthsModule } from './woolworths/woolworths.module';
import { ColesModule } from './coles/coles.module';

@Module({
  providers: [RetailersService, RetailersResolver],
  imports: [WoolworthsModule, ColesModule],
})
export class RetailersModule {}
