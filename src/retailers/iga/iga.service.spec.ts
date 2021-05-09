import { Test, TestingModule } from '@nestjs/testing';
import { IgaService } from './iga.service';

describe('IgaService', () => {
  let service: IgaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IgaService],
    }).compile();

    service = module.get<IgaService>(IgaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
