import { Module } from '@nestjs/common';
import { ConfigService } from '../config/configuration';
import { SendgridService } from './sendgrid.service';

@Module({
  controllers: [],
  providers: [SendgridService, ConfigService],
  exports: [SendgridService, ConfigService],
})
export class UtilsModule {}
