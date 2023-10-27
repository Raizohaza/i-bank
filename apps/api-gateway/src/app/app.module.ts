import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '../config/configuration';
import { AccountController } from './account.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerController } from './customer.controller';
import { AuthGuard } from './guards/authorization.guard';
import { PermissionGuard } from './guards/permission.guard';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [ConfigService],
  controllers: [AppController, CustomerController, AccountController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: 'CUSTOMER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const customerServiceOptions = configService.get('customerService');
        return ClientProxyFactory.create(customerServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'TOKEN_SERVICE',
      useFactory: (configService: ConfigService) => {
        const tokenServiceOptions = configService.get('tokenService');
        return ClientProxyFactory.create(tokenServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'PERMISSION_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          configService.get('permissionService')
        );
      },
      inject: [ConfigService],
    },
    {
      provide: 'ACCOUNT_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('accountService'));
      },
      inject: [ConfigService],
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
