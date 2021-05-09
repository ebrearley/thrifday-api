import { Test, TestingModule } from '@nestjs/testing';
import { RetailersResolver } from './retailers.resolver';

describe('RetailersResolver', () => {
  let resolver: RetailersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RetailersResolver],
    }).compile();

    resolver = module.get<RetailersResolver>(RetailersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
