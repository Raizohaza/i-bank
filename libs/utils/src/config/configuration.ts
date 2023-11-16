import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: unknown } = null;
  constructor() {
    this.envConfig = {};
    // this.envConfig.port = parseInt(process.env.PORT, 10) || 3000;
    this.envConfig['X_SECRET'] = process.env['X_SECRET'] || 'abc';
    this.envConfig.SECRET_KEY = process.env.SECRET_KEY || 'SECRET_KEY';
    this.envConfig.SENDGRID_API_KEY =
      process.env.SENDGRID_API_KEY ||
      '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';
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
    this.envConfig.receiverService = {
      options: {
        // host: '127.0.0.1',
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
        port: parseInt(process.env.PORT, 10) || 3004,
      },
      transport: Transport.TCP,
    };
    this.envConfig.employeeService = {
      options: {
        port: parseInt(process.env.PORT, 10) || 4001,
      },
      transport: Transport.TCP,
    };
    this.envConfig.debtService = {
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
