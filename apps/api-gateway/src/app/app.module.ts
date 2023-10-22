import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '../config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [ConfigService],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const authServiceOptions = configService.get('authService');
        console.log(authServiceOptions);
        return ClientProxyFactory.create(authServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
