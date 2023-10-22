import { ClientOptions, Transport } from '@nestjs/microservices';

export default (): ClientOptions => ({
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 6789,
  },
});
