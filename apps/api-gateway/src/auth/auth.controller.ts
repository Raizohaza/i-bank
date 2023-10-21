import { Controller } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import {
  ClientOptions,
  ClientProxy,
  ClientProxyFactory,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateAuthDto, UpdateAuthDto } from '@lib/shared/dto';
import { Get, Inject } from '@nestjs/common/decorators';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('MATH_SERVICE') private client: ClientProxy
  ) {}

  @MessagePattern('createAuth')
  create(@Payload() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @MessagePattern('findAllAuth')
  findAll() {
    return this.authService.findAll();
  }
  @Get('findAll')
  findAll2() {
    return this.authService.findAll();
  }
  @Get('findAllAuth')
  findAllByRestFul(): Observable<string> {
    const microservicesOptions: ClientOptions = {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 6789,
      },
    };
    const logger = new Logger('auth');
    logger.log('This action adds a new auth');
    const client = ClientProxyFactory.create(microservicesOptions);
    return client.send<string>('findAllAuth', {});
  }

  @MessagePattern('findOneAuth')
  findOne(@Payload() id: number) {
    return this.authService.findOne(id);
  }

  @MessagePattern('updateAuth')
  update(@Payload() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(updateAuthDto.id, updateAuthDto);
  }

  @MessagePattern('removeAuth')
  remove(@Payload() id: number) {
    return this.authService.remove(id);
  }
}
