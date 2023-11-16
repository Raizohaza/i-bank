import { Module } from '@nestjs/common';
import { DebtService } from './debt.service';
import { DebtController } from './debt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@i-bank/utils';
import { MongoConfigService } from '@i-bank/utils';
import { DebtSchema } from './entities/debt.entity';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigService,
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Debt',
        schema: DebtSchema,
        collection: 'debts',
      },
    ]),
  ],
  controllers: [DebtController],
  providers: [
    DebtService,
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
  ],
})
export class DebtModule {}
