import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: unknown } = null;

  constructor() {
    this.envConfig = {
      port: process.env.TRANSACTION_SERVICE_PORT,
    };
    this.envConfig.baseUri = process.env.BASE_URI;
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.transactionService = {
      options: {
        port: process.env.TRANSACTION_SERVICE_PORT || 3007,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): unknown {
    return this.envConfig[key];
  }
}
