import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions } from '@nestjs/microservices';

import { TokenModule } from './token.module';
import { ConfigService } from '@i-bank/utils';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TokenModule, {
    transport: Transport.TCP,
    options: {
      port: new ConfigService().get('port') || 3002,
    },
  } as TcpOptions);
  await app.listen();
}
bootstrap();
