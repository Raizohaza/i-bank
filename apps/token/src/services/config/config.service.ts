export class ConfigService {
  private readonly envConfig: { [key: string]: unknown } = null;

  constructor() {
    this.envConfig = {
      port: process.env.TOKEN_SERVICE_PORT,
    };
  }

  get(key: string): unknown {
    return this.envConfig[key];
  }
}
