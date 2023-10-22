import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { ClientOptions, ClientProxyFactory } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CreateAuthDto, UpdateAuthDto } from '@lib/shared/dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService
  ) {}
  private client = ClientProxyFactory.create({
    transport: this.configService.get<number>('transport'),
    options: this.configService.get<ClientOptions>('options'),
  });
  @Get('findAllAuth2')
  findAllByRestFul(): Observable<string> {
    return this.client.send<string>('findAllAuth2', {});
  }
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll(): Observable<string> {
    const logger = new Logger('auth');
    logger.log('This action adds a new auth', {
      transport: this.configService.get('transport'),
      options: this.configService.get('options'),
    });
    console.log('This action adds a new auth', {
      transport: this.configService.get('transport'),
      options: this.configService.get('options'),
    });
    return this.client.send<string>('findAllAuth2', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
