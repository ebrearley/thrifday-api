import { Test, TestingModule } from '@nestjs/testing';
import { CostcoService } from './costco.service';

describe('CostcoService', () => {
  let service: CostcoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostcoService],
    }).compile();

    service = module.get<CostcoService>(CostcoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
