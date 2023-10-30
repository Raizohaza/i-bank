import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: unknown } = null;
  constructor() {
    this.envConfig = {};
    this.envConfig.port = parseInt(process.env.PORT, 10) || 3000;
    this.envConfig.customerService = {
      transport: Transport.TCP,
      options: {
        port: parseInt(process.env.PORT, 10) || 3001,
      },
    };
    this.envConfig.tokenService = {
      options: {
        port: parseInt(process.env.PORT, 10) || 3002,
      },
      transport: Transport.TCP,
    };
    this.envConfig.permissionService = {
      options: {
        port: parseInt(process.env.PORT, 10) || 3003,
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
