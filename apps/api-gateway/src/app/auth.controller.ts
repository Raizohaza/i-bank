import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';
import { CreateAuthDto, UpdateAuthDto } from '@lib/shared/dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy
  ) {}
  @Get('findAllAuth2')
  findAllByRestFul(): Observable<string> {
    return this.authService.send<string>('findAllAuth2', {});
  }
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.send('createAuth', createAuthDto);
  }

  @Get()
  async findAll() {
    const logger = new Logger('auth');
    // logger.log('This action adds a new auth', {
    //   transport: this.configService.get('transport'),
    //   options: this.configService.get('options'),
    // });
    // console.log('This action adds a new auth', {
    //   transport: this.configService.get('transport'),
    //   options: this.configService.get('options'),
    // });
    return await firstValueFrom(
      this.authService.send<string>('findAllAuth2', {})
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.send('findOneAuth', +id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    updateAuthDto.id = +id;
    return await firstValueFrom(
      this.authService.send('updateAuth', updateAuthDto)
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.send('removeAuth', +id);
  }
}
