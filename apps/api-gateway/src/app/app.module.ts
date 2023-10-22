import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import configuration from '../config/configuration';
import configurationClient from '../config/configuration.client';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ load: [configuration, configurationClient] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
