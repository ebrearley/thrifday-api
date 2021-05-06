import { HttpModule, Module } from '@nestjs/common';
import { IgaService } from './iga.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  providers: [IgaService],
  exports: [IgaService],
})
export class IgaModule {}
