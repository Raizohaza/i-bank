import { Module } from '@nestjs/common';
import { LinkingBankService } from './linking-bank.service';
import { LinkingBankController } from './linking-bank.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@i-bank/utils';
import { MongoConfigService } from '@i-bank/utils';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigService,
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
  ],
  controllers: [LinkingBankController],
  providers: [
    ConfigService,
    {
      provide: 'ACCOUNT_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('accountService'));
      },
      inject: [ConfigService],
    },
    {
      provide: 'TRANSACTION_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          configService.get('transactionService')
        );
      },
      inject: [ConfigService],
    },
    LinkingBankService,
  ],
})
export class LinkingBankModule {}
