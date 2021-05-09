import { HttpModule, Module } from '@nestjs/common';
import { ColesService } from './coles.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  providers: [ColesService],
  exports: [ColesService],
})
export class ColesModule {}
