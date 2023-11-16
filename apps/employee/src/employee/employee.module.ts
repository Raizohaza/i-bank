import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@i-bank/utils';
import { MongoConfigService } from '@i-bank/utils';
import { EmployeeSchema } from './entities/employee.entity';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConstants } from '../strategies/constants';
import { LocalStrategy } from '../strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    ConfigService,
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([{ name: 'employee', schema: EmployeeSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {
        expiresIn: '60d',
      },
    }),
  ],
  controllers: [EmployeeController],
  providers: [ConfigService, EmployeeService, LocalStrategy],
})
export class EmployeeModule {}
