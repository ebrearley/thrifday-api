import { HttpModule, Module } from '@nestjs/common';
import { WoolworthsService } from './woolworths.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  providers: [WoolworthsService],
  exports: [WoolworthsService],
})
export class WoolworthsModule {}
