import { Test, TestingModule } from '@nestjs/testing';
import { LinkingBankService } from './linking-bank.service';

describe('LinkingBankService', () => {
  let service: LinkingBankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkingBankService],
    }).compile();

    service = module.get<LinkingBankService>(LinkingBankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
