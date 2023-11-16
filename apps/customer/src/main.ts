import { NestFactory } from '@nestjs/core';
import { CustomerModule } from './customer.module';
import { Transport, TcpOptions } from '@nestjs/microservices';

import { ConfigService } from '@i-bank/utils';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CustomerModule, {
    transport: Transport.TCP,
    options: {
      port: new ConfigService().get('port') || 3001,
    },
  } as TcpOptions);
  await app.listen();
}
bootstrap();
