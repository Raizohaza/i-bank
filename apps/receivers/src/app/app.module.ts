import { Module } from '@nestjs/common';
import { ReceiversModule } from '../receivers/receivers.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ReceiversModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
