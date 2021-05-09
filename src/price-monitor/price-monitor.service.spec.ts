import { Test, TestingModule } from '@nestjs/testing';
import { PriceMonitorService } from './price-monitor.service';

describe('PriceMonitorService', () => {
  let service: PriceMonitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceMonitorService],
    }).compile();

    service = module.get<PriceMonitorService>(PriceMonitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
