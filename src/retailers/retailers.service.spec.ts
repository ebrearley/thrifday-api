import { Test, TestingModule } from '@nestjs/testing';
import { RetailersService } from './retailers.service';

describe('RetailersService', () => {
  let service: RetailersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetailersService],
    }).compile();

    service = module.get<RetailersService>(RetailersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
