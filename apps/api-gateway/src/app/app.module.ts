import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './guards/authorization.guard';
import { PermissionGuard } from './guards/permission.guard';
import { RolesGuard } from './guards/roles.guard';
import { RsaGuard } from './guards/rsa.guard';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { RpcServicesModule } from './modules/RpcServices.module';
import { UtilsModule } from '@i-bank/utils';
import { ConfigService } from 'libs/utils/src/config/configuration';
import { SendgridService } from 'libs/utils/src/lib/sendgrid.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthRefreshGuard } from './guards/authorizationRefresh.guard';

@Module({
  imports: [
    ConfigService,
    RpcServicesModule,
    UtilsModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    SendgridService,
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
      provide: 'EMPLOYEE_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('employeeService'));
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
    {
      provide: APP_GUARD,
      useClass: RsaGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthRefreshGuard,
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
