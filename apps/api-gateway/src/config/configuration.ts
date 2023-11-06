import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: unknown } = null;
  constructor() {
    this.envConfig = {};
    this.envConfig.port = parseInt(process.env.PORT, 10) || 3000;
    this.envConfig['x-secret'] = process.env['x-secret'] || 'abc';
    this.envConfig.SECRET_KEY = process.env.SECRET_KEY;
    console.log(process.env['x-secret']);
    this.envConfig.customerService = {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT, 10) || 3001,
      },
    };
    this.envConfig.tokenService = {
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT, 10) || 3002,
      },
      transport: Transport.TCP,
    };
    this.envConfig.permissionService = {
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT, 10) || 3003,
      },
      transport: Transport.TCP,
    };
    this.envConfig.accountService = {
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT, 10) || 3005,
      },
      transport: Transport.TCP,
    };
    this.envConfig.receiverService = {
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT, 10) || 3006,
      },
      transport: Transport.TCP,
    };
    this.envConfig.transactionService = {
      options: {
        port: parseInt(process.env.PORT, 10) || 3007,
      },
      transport: Transport.TCP,
    };
    this.envConfig.linkingBankService = {
      options: {
        port: parseInt(process.env.PORT, 10) || 3008,
      },
      transport: Transport.TCP,
    };
  }
  get(key: string): unknown {
    return this.envConfig[key];
  }
}
