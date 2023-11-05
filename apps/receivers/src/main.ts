

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const port = new ConfigService().get('port') || 3006;
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      port: port,
    },
  } as TcpOptions);
  await app.listen();
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
