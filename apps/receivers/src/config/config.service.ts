import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: unknown } = null;

  constructor() {
    this.envConfig = {
      port: process.env.RECEIVER_SERVICE_PORT,
    };
    this.envConfig.baseUri = process.env.BASE_URI;
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.accountService = {
      options: {
        port: process.env.ACOUNT_SERVICE_PORT || 3005,
      },
      transport: Transport.TCP,
    };
    this.envConfig.customerService = {
      options: {
        port: process.env.CUSTOMER_SERVICE_PORT || 3001,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): unknown {
    return this.envConfig[key];
  }
}
