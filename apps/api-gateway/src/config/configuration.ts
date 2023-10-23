import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;
  constructor() {
    this.envConfig = {};
    this.envConfig.port = parseInt(process.env.PORT, 10) || 3000;
    this.envConfig.userService = {
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
  }
  get(key: string): unknown {
    return this.envConfig[key];
  }
}
