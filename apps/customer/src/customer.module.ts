import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerController } from './customer.controller';
import { CustomerService } from './services/customer.service';
import { ConfigService } from '@i-bank/utils';
import { MongoConfigService } from '@i-bank/utils';
import { CustomerSchema } from './schemas/customer.schema';
import { CustomerLinkSchema } from './schemas/customer-link.schema';
import { SendgridService } from '@i-bank/utils';
import { UtilsModule } from '@i-bank/utils';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Customer',
        schema: CustomerSchema,
        collection: 'customers',
      },
      {
        name: 'CustomerLink',
        schema: CustomerLinkSchema,
        collection: 'customer_links',
      },
    ]),
    UtilsModule,
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    ConfigService,
    {
      provide: 'MAILER_SERVICE',
      useClass: SendgridService,
    },
    {
      provide: 'ACCOUNT_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('accountService'));
      },
      inject: [ConfigService],
    },
  ],
})
export class CustomerModule {}
