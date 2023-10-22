import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;
  constructor() {
    this.envConfig = {};
    this.envConfig.port = parseInt(process.env.PORT, 10) || 3000;
    this.envConfig.authService = {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: parseInt(process.env.PORT, 10) || 3001,
      },
    };
  }
  get(key: string): unknown {
    return this.envConfig[key];
  }
}
