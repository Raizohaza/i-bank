import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';
import { ConfigService } from '@i-bank/utils';
import { DebtModule } from './debt/debt.module';

async function bootstrap() {
  const port = new ConfigService().get('port') || 3008;
  const app = await NestFactory.createMicroservice(DebtModule, {
    transport: Transport.TCP,
    options: {
      port: port,
    },
  } as TcpOptions);
  await app.listen();
  Logger.log(`🚀 Application is running on: http://localhost:${port}}`);
}

bootstrap();
