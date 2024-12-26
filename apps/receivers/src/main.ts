

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';

import { ReceiversModule } from './receivers/receivers.module';

async function bootstrap() {
  const port = new ConfigService().get('port') || 3006;
  const app = await NestFactory.createMicroservice(ReceiversModule, {
    transport: Transport.TCP,
    options: {
      port: port,
    },
  } as TcpOptions);
  await app.listen();
  Logger.log(`🚀 Receivers is running on: http://localhost:${port}`);
}

bootstrap();
