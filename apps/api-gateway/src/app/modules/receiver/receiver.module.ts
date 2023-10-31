import { Module } from '@nestjs/common';
import { ReceiverController } from './receiver.controller';

@Module({
  controllers: [ReceiverController],
})
export class ReceiverModule {}
