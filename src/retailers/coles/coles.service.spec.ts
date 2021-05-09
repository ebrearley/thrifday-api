import { Test, TestingModule } from '@nestjs/testing';
import { ColesService } from './coles.service';

describe('ColesService', () => {
  let service: ColesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColesService],
    }).compile();

    service = module.get<ColesService>(ColesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
