import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { CreateLinkingBankDto } from './dto/create-linking-bank.dto';
import { Header, Inject, Patch, Req } from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  Authorization,
  BasicAuthorization,
} from '../../decorators/authorization.decorator';
import { lastValueFrom } from 'rxjs';
import {
  abineEncrypt,
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
import { defaultHash } from '../../utils/hash';
import { ICustomer } from './dto/customer.interface';
import * as SendGrid from '@sendgrid/mail';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { BaseReponse } from '../../interfaces/common/base-reponse.dto';
import { CreateReceiverDto } from './dto/create-receiver.dto';

@ApiTags('linking-banks')
@Controller('linking-banks')
export class LinkingBanksController {
  constructor(
    @Inject('LINKING_BANKS_SERVICE')
    private readonly linkingBanksService: ClientProxy,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy,
    @Inject('MAILER_SERVICE') private readonly mailerService,
    @Inject('RECEIVER_SERVICE') private readonly receiverService: ClientProxy,
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
  async tranferToLinkedBank(@Param('accountNum') accountNum: string) {
    return await lastValueFrom(
      this.linkingBanksService.send('remoteFindByAccountNumber', accountNum)
    );
  }

  @Get('external/account/:accountNum')
  // @BasicAuthorization(true)
  findOneExternal(@Param('accountNum') accountNum: string) {
    const HOME = 'https://cfbank-backend-raizohaza.cloud.okteto.net';
    const ACCOUNT = `/linking-banks/account/${accountNum}`; //1234567891011
    const SECRET_KEY = this.config.get('X_SECRET');

    const getAccountInfo = async () => {
      const now = Date.now().toString();

      const res = await fetch(HOME + ACCOUNT, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': hash(ACCOUNT + now + SECRET_KEY),
          'x-time': now,
        },
      });
      return res.json();
    };
    return getAccountInfo();
  }
  @ApiBearerAuth()
  @Post('external/transfer/out')
  @Authorization(true)
  async transferExternalOut(
    @Body() tranferDTO: CreateTransactionAbineDto,
    @Req() req
  ) {
    const HOME = 'https://cfbank-backend-raizohaza.cloud.okteto.net';
    // const HOME = ' https://3713-2001-ee0-d789-5790-4489-dd18-2b2f-ae09.ngrok-free.app';
    const SECRET_KEY = this.config.get('X_SECRET');

    const TRANSFER = '/linking-banks/external/transfer/in';
    const now = Date.now().toString();
    const feePayer: 'SENDER' | 'RECIPIENT' = 'SENDER';
    const fetchData = await fetch(HOME + '/linking-banks/public.pem');
    const publicKey: KeyLike = await fetchData.text();
    const sign = signature(
      Buffer.from(
        JSON.stringify({
          fromAccountNumber: tranferDTO.fromAccount,
          toAccountNumber: tranferDTO.toAccount,
          amount: tranferDTO.amount,
          content: tranferDTO.contentTransaction,
          feePayer,
        })
      )
    ).toString('base64');

    const encryptedData = {
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
      sign,
    };
    console.log({
      headers: {
        'x-api-key': hash(TRANSFER + now + SECRET_KEY),
        'x-time': now,
      },
      body: JSON.stringify({ ...encryptedData }),
    });
    const newTrans = await this.createTransaction(tranferDTO, req);

    const res = await fetch(HOME + TRANSFER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': hash(TRANSFER + now + SECRET_KEY),
        'x-time': now,
      },
      body: JSON.stringify({ ...encryptedData }),
    });
    console.log(res);

    const remoteRequest = res.text();
    const response = new BaseReponse();
    response.data = {
      newTrans,
      remoteRequest,
    };
    return response;
  }
  async createTransaction(tranferDTO: CreateTransactionAbineDto, req) {
    const customer: ICustomer = req.customer;
    if (!tranferDTO.customerId) {
      tranferDTO.customerId = customer.id;
    }
    if (!tranferDTO.fromName) tranferDTO.fromName = customer.name;

    tranferDTO.fromAccountNumber = tranferDTO.fromAccount;
    tranferDTO.toAccountNumber = tranferDTO.toAccount;
    tranferDTO.OTPToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await this.sendOTP(tranferDTO, customer);
    const data = await lastValueFrom(
      this.transactionService.send('createTransactionAbineOut', tranferDTO)
    );
    return data;
  }
  async sendOTP(
    createTransactionDto: CreateTransactionAbineDto,
    customer: ICustomer
  ) {
    if (!createTransactionDto.customerId) {
      createTransactionDto.customerId = customer.id;
    }
    if (!createTransactionDto.fromName)
      createTransactionDto.fromName = customer.name;
    const sgTemplate = 'd-8f6fe985b8334f63ab19a399b22528a0';
    const mail: SendGrid.MailDataRequired = {
      to: customer.email,
      subject: 'OTP trancational confirmation',
      from: 'toanphamhcmus@gmail.com',
      dynamicTemplateData: {
        email: 'toanphamhcmus@gmail.com',
        headerText: 'confirm your transaction',
        code: createTransactionDto.OTPToken,
      },
      templateId: sgTemplate,
    };
    console.log(mail);

    return await this.mailerService.send(mail);
  }
  @ApiBearerAuth()
  @Patch('updateBalance/:id')
  @Authorization(true)
  updateBalance(
    @Param('id') id: string,
    @Body() updateBalanceDto: UpdateBalanceDto
  ) {
    updateBalanceDto.id = id;
    return lastValueFrom(
      this.transactionService.send('setBalanceAbine', updateBalanceDto)
    );
  }
  @ApiBearerAuth()
  @Post('createReceiver')
  @Authorization(true)
  async createReceiver(
    @Body() createReceiverDto: CreateReceiverDto,
    @Req() request
  ) {
    createReceiverDto.customerId = request.customer.id;
    const result = await lastValueFrom(
      this.receiverService.send('createReceiverAbine', createReceiverDto)
    );
    return result;
  }

  @Post('external/transfer/in')
  @ApiHeader({ name: 'x-api-key' })
  @ApiHeader({ name: 'x-time' })
  @BasicAuthorization(true)
  @Verify(true)
  async transferExternalIn(@Body() tranferDTO: CreateTransactionAbineDto) {
    const data = await lastValueFrom(
      this.transactionService.send('createTransactionAbine', tranferDTO)
    );
    console.log(data);

    return {
      message: 'Success',
      response: {
        abineSign: tranferDTO['sign'],
        sign: signature(Buffer.from(JSON.stringify(tranferDTO))).toString(
          'base64'
        ),
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
    const encrypted = encrypt(tranferDTO).toString('base64');
    const sign = signature(Buffer.from(JSON.stringify(tranferDTO))).toString(
      'base64'
    );

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
  @Header('Content-Type', 'application/x-pem-file')
  @Header('Content-Disposition', 'attachment; filename="public.pem"')
  // @BasicAuthorization(true)
  getPublicKey() {
    const file = createReadStream(join(process.cwd(), 'public.pem'));
    return new StreamableFile(file);
  }
}
