import { Test, TestingModule } from '@nestjs/testing';
import { ReceiversController } from './receivers.controller';
import { ReceiversService } from './receivers.service';

describe('ReceiversController', () => {
  let controller: ReceiversController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiversController],
      providers: [ReceiversService],
    }).compile();

    controller = module.get<ReceiversController>(ReceiversController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
