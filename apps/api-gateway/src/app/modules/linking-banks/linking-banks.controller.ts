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
import {
  abineEncrypt,
  createKey,
  decrypt,
  encrypt,
  hash,
  signature,
} from '../../utils/rsa.encrypt';
import fetch from 'node-fetch';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CreateTransactionAbineDto } from './dto/create-transaction-abine.dto';
import { KeyLike } from 'crypto';
import { Verify } from '../../decorators/rsa.decorator';
import * as fs from 'fs';
import { defaultHash } from '../../utils/hash';
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

  @Post('transfer/:accountNum')
  @ApiHeader({ name: 'x-api-key' })
  @ApiHeader({ name: 'x-time' })
  @BasicAuthorization(true)
  async tranferToLinkedBank(@Param('accountNum') accountNum: string) {
    return await lastValueFrom(
      this.linkingBanksService.send('remoteFindByAccountNumber', accountNum)
    );
  }

  @Get('external/account/:accountNum')
  // @BasicAuthorization(true)
  findOneExternal(@Param('accountNum') accountNum: string) {
    const HOME = 'https://abine.fly.dev';
    const ACCOUNT = `/api/external/account/${accountNum}`; //1234567891011
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

  @Post('external/transfer/out')
  // @BasicAuthorization(true)
  async transferExternalOut(@Body() tranferDTO: CreateTransactionAbineDto) {
    const HOME = 'https://abine.fly.dev';
    const TRANSFER = '/api/external/transfer';
    const now = Date.now().toString();
    const feePayer: 'SENDER' | 'RECIPIENT' = 'RECIPIENT';
    const stream = await fetch(HOME + '/public.pem');

    const publicKey: KeyLike = await new Promise((resolve, reject) => {
      res.body?.on('data', (chunk) => {
        resolve(chunk.toString());
      });
      stream.body?.on('error', reject);
    });
    const res = await fetch(HOME + TRANSFER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Auth: hash(TRANSFER + now + process.env.SECRET_KEY),
        Time: now,
      },
      body: JSON.stringify({
        encrypted: abineEncrypt(
          {
            fromAccountNumber: tranferDTO.fromAccount,
            toAccountNumber: tranferDTO.toAccount,
            amount: tranferDTO.amount,
            content: tranferDTO.contentTransaction,
            feePayer,
          },
          publicKey
        ),
      }),
    });

    return res.json();
  }

  @Post('external/transfer/in')
  @ApiHeader({ name: 'x-api-key' })
  @ApiHeader({ name: 'x-time' })
  @BasicAuthorization(true)
  @Verify(true)
  async transferExternalIn(@Body() tranferDTO: CreateTransactionAbineDto) {
    return {
      message: 'Success',
      data: {
        sign: signature(tranferDTO).toString('base64'),
      },
    };
  }

  @Get('external/transfer/in/exampleCall')
  // @BasicAuthorization(true)
  async exampleCall() {
    const HOME = 'http://localhost:3333';
    const TRANSFER = '/linking-banks/external/transfer/in';
    const now = Date.now().toString();

    const dataToEncrypt = {
      fromAccountNumber: '1234567891011',
      toAccountNumber: '1234567891012',
      amount: 1_000_000,
      content: 'aaaa',
      feePayer: 'SENDER',
    };

    const tranferDTO: CreateTransactionAbineDto = {
      fromAccount: dataToEncrypt.fromAccountNumber,
      toAccount: dataToEncrypt.toAccountNumber,
      amount: dataToEncrypt.amount,
      contentTransaction: dataToEncrypt.content,
      type: dataToEncrypt.feePayer,
    };
    const eData = JSON.stringify(tranferDTO);
    const encrypted = encrypt(eData).toString('base64');
    const sign = signature(eData).toString('base64');

    const res = await fetch(HOME + TRANSFER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Auth: hash(TRANSFER + now + process.env.SECRET_KEY),
        Time: now,
      },
      body: JSON.stringify({ encrypted, sign }),
    });
    const time: string = Date.now().toString();

    const token = defaultHash(time, TRANSFER);

    return JSON.stringify({ time, token, encrypted, sign });
  }

  // @Get('rsa/generateKey')
  // generateKey() {
  //   createKey();
  // }

  // @Get('rsa/encrypt')
  // encrypt() {
  //   return encrypt({ message: 'hi mom' });
  // }
  // @Post('rsa/decrypt')
  // decrypt(@Body() body: { message: string }) {
  //   return decrypt(body.message);
  // }

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
