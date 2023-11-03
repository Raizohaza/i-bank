import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './entities/transaction.entity';
import { MongoConfigService } from '../config/mongo-config.service';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ConfigService,
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Transaction',
        schema: TransactionSchema,
        collection: 'transactions',
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [ConfigService, TransactionService],
})
export class TransactionModule {}
