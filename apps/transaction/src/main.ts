import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';
import { TransactionModule } from './transaction/transaction.module';

async function bootstrap() {
  const port = new ConfigService().get('port') || 3007;
  const app = await NestFactory.createMicroservice(TransactionModule, {
    transport: Transport.TCP,
    options: {
      port: port,
    },
  } as TcpOptions);
  await app.listen();
  Logger.log(`🚀 Application is running on: http://localhost:${port}}`);
}

bootstrap();
