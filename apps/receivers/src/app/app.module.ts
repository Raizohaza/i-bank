import { Module } from '@nestjs/common';
import { ConfigService } from '@i-bank/utils';
import { ReceiversModule } from '../receivers/receivers.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ReceiversModule, ConfigService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
