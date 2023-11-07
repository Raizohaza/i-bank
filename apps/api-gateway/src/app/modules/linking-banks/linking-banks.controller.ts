import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { CreateLinkingBankDto } from './dto/create-linking-bank.dto';
import { Header, Inject } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  Authorization,
  BasicAuthorization,
} from '../../decorators/authorization.decorator';
import { lastValueFrom } from 'rxjs';
import { createKey, decrypt, encrypt, hash } from '../../utils/rsa.encrypt';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('linking-banks')
@Controller('linking-banks')
export class LinkingBanksController {
  constructor(
    @Inject('LINKING_BANKS_SERVICE')
    private readonly linkingBanksService: ClientProxy,
    @Inject('CONFIG_SERVICE')
    private config: ConfigService
  ) {}

  // @Post()
  // @Authorization(true)
  // create(@Body() createLinkingBankDto: CreateLinkingBankDto) {
  //   return lastValueFrom(this.linkingBanksService.send('findAllBanks', {}));
  // }
  @Post()
  @Authorization(true)
  createTransfer(@Body() createLinkingBankDto: CreateLinkingBankDto) {
    return lastValueFrom(
      this.linkingBanksService.send('createTransfer', createLinkingBankDto)
    );
  }
  // @Get()
  // @Authorization(true)
  // findAll() {
  //   return lastValueFrom(this.linkingBanksService.send('findAllBanks', {}));
  // }

  @Get('account/:accountNum')
  @ApiHeader({ name: 'x-api-key' })
  @ApiHeader({ name: 'x-time' })
  @BasicAuthorization(true)
  findOne(@Param('accountNum') accountNum: string) {
    return lastValueFrom(
      this.linkingBanksService.send('remoteFindByAccountNumber', accountNum)
    );
  }

  @Get('external/account/:accountNum')
  // @BasicAuthorization(true)
  findOneExternal(@Param('accountNum') accountNum: string) {
    const HOME = 'https://abine.fly.dev';
    const ACCOUNT = `/api/external/account/${accountNum}`; //1234567891011
    const TRANSFER = '/api/external/transfer';
    const SECRET_KEY = this.config.get('SECRET_KEY');

    const getAccountInfo = async () => {
      const now = Date.now().toString();

      const res = await fetch(HOME + ACCOUNT, {
        headers: {
          'Content-Type': 'application/json',
          Auth: hash(ACCOUNT + now + SECRET_KEY),
          Time: now,
        },
      });
      return res.json();
    };
    return getAccountInfo();
  }

  @Get('rsa/generateKey')
  generateKey() {
    createKey();
  }

  @Get('rsa/encrypt')
  encrypt() {
    return encrypt({ message: 'hi mom' });
  }
  @Post('rsa/decrypt')
  decrypt(@Body() body: { message: string }) {
    return decrypt(body.message);
  }

  @Get('public.pem')
  @ApiHeader({ name: 'x-api-key' })
  @ApiHeader({ name: 'x-time' })
  @Header('Content-Type', 'application/x-pem-file')
  @Header('Content-Disposition', 'attachment; filename="public.pem"')
  // @BasicAuthorization(true)
  getPublicKey() {
    const file = createReadStream(join(process.cwd(), 'public.pem'));
    return new StreamableFile(file);
  }
}
