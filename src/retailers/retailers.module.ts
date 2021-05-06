import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RetailersService } from './retailers.service';
import { RetailersResolver } from './retailers.resolver';
import { WoolworthsModule } from './woolworths/woolworths.module';
import { ColesModule } from './coles/coles.module';
import { CostcoModule } from './costco/costco.module';
import { IgaModule } from './iga/iga.module';
import { RetailerProductEntity } from './entities/retailer-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RetailerProductEntity]),
    WoolworthsModule,
    ColesModule,
    CostcoModule,
    IgaModule,
  ],
  providers: [RetailersService, RetailersResolver],
  exports: [RetailersService],
})
export class RetailersModule {}
