import { Test, TestingModule } from '@nestjs/testing';
import { WoolworthsService } from './woolworths.service';

describe('WoolworthsService', () => {
  let service: WoolworthsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WoolworthsService],
    }).compile();

    service = module.get<WoolworthsService>(WoolworthsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
