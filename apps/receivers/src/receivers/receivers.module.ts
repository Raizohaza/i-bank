import { Module } from '@nestjs/common';
import { ReceiversService } from './receivers.service';
import { ReceiversController } from './receivers.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from '../config/mongo-config.service';
import { ReceiverSchema } from './entities/receiver.entity';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ConfigService,
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Receiver',
        schema: ReceiverSchema,
        collection: 'receivers',
      },
    ]),
  ],
  controllers: [ReceiversController],
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
      provide: 'CUSTOMER_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('customerService'));
      },
      inject: [ConfigService],
    },
    ReceiversService,
  ],
})
export class ReceiversModule {}
