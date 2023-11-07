import { Test, TestingModule } from '@nestjs/testing';
import { LinkingBankController } from './linking-bank.controller';
import { LinkingBankService } from './linking-bank.service';

describe('LinkingBankController', () => {
  let controller: LinkingBankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkingBankController],
      providers: [LinkingBankService],
    }).compile();

    controller = module.get<LinkingBankController>(LinkingBankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
