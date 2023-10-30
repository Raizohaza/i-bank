import { Module } from '@nestjs/common';
import { ReceiverService } from './receiver.service';
import { ReceiverController } from './receiver.controller';

@Module({
  controllers: [ReceiverController],
  providers: [ReceiverService]
})
export class ReceiverModule {}
