import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: unknown } = null;

  constructor() {
    this.envConfig = {
      port: process.env.CUSTOMER_SERVICE_PORT,
    };
    this.envConfig.baseUri = process.env.baseUri || 'http://localhost';
    this.envConfig.gatewayPort = process.env.gatewayPort || 3333;
    this.envConfig.mailerService = {
      options: {
        port: process.env.MAILER_SERVICE_PORT,
        host: process.env.MAILER_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.accountService = {
      options: {
        port: parseInt(process.env.PORT, 10) || 3005,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): unknown {
    return this.envConfig[key];
  }
}
