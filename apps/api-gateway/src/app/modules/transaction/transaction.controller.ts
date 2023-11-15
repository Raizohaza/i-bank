import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../decorators/authorization.decorator';
import { IServiceAccount } from '../account/service-account.interface';
import { BaseReponse } from '../../interfaces/common/base-reponse.dto';
import { HttpStatus } from '@nestjs/common/enums';
import { ICustomer } from '../customer';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { FindAllDTO } from './dto/find-all.dto';
import * as SendGrid from '@sendgrid/mail';
import * as moment from 'moment';

@ApiBearerAuth()
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy,
    @Inject('ACCOUNT_SERVICE')
    private readonly accountService: ClientProxy,
    @Inject('MAILER_SERVICE') private readonly mailerService
  ) {}

  @Post()
  @Authorization(true)
  async create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    const customer: ICustomer = req.customer;
    if (!createTransactionDto.customerId) {
      createTransactionDto.customerId = customer.id;
    }
    if (!createTransactionDto.fromName)
      createTransactionDto.fromName = customer.name;
    createTransactionDto.OTPToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await this.sendOTP(createTransactionDto, customer);
    // return true;
    return await lastValueFrom(
      this.transactionService.send('createTransaction', createTransactionDto)
    )
      .then((respone) => {
        return <BaseReponse>{
          status: HttpStatus.CREATED,
          message: 'success',
          data: respone,
        };
      })
      .catch((e) => {
        console.log(e);
        throw new BadRequestException('Not enough balance remain');
      });
  }
  async sendOTP(
    createTransactionDto: CreateTransactionDto,
    customer: ICustomer
  ) {
    if (!createTransactionDto.customerId) {
      createTransactionDto.customerId = customer.id;
    }
    if (!createTransactionDto.fromName)
      createTransactionDto.fromName = customer.name;
    const sgTemplate = 'd-e12e8d5e02074d79b04502f2aa32e7fd';
    const mail: SendGrid.MailDataRequired = {
      to: customer.email,
      subject: 'OTP trancational confirmation',
      from: 'laptrinhweb100@gmail.com',
      dynamicTemplateData: {
        email: 'laptrinhweb100@gmail.com',
        headerText: 'confirm your transaction',
        code: createTransactionDto.OTPToken,
      },
      templateId: sgTemplate,
    };
    console.log(mail);

    return await this.mailerService.send(mail);
  }

  @Post('createByAccountNumber')
  @Authorization(true)
  async createByAccountNumber(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req
  ) {
    const customer: ICustomer = req.customer;
    if (!createTransactionDto.customerId) {
      createTransactionDto.customerId = customer.id;
    }
    if (!createTransactionDto.fromName)
      createTransactionDto.fromName = customer.name;
    createTransactionDto.OTPToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    await this.sendOTP(createTransactionDto, customer);
    // return true;
    return await lastValueFrom(
      this.transactionService.send(
        'createTransactionByAccountNumber',
        createTransactionDto
      )
    )
      .then((respone) => {
        return <BaseReponse>{
          status: HttpStatus.CREATED,
          message: 'success',
          data: respone,
        };
      })
      .catch((e) => {
        console.log(e);
        throw new BadRequestException('Not enough balance remain');
      });
  }
  @Patch('updateBalance/:id')
  @Authorization(true)
  updateBalance(
    @Param('id') id: string,
    @Body() updateBalanceDto: UpdateBalanceDto
  ) {
    updateBalanceDto.id = id;
    return lastValueFrom(
      this.transactionService.send('setBalance', updateBalanceDto)
    );
  }
  @Get()
  @Authorization(true)
  findAll(@Query() findAllDTO: FindAllDTO) {
    const to = moment(findAllDTO.to);
    const from = moment(findAllDTO.from);
    const data = moment.duration({ from, to });
    console.log({ from, to, days: data.days() });

    if (data.days() > 30 || data.months() > 0)
      throw new BadRequestException('No more than 30 days');
    return lastValueFrom(
      this.transactionService.send('findAllTransaction', findAllDTO)
    );
  }

  @Get('byCustomerId/:customerId')
  @Authorization(true)
  async GetAllByCustomerId(
    // @Req() request: IAuthorizedRequest
    @Param('customerId') customerId: string
  ): Promise<BaseReponse> {
    // const customer = request.customer;
    console.log(customerId);

    const response: IServiceAccount = await firstValueFrom(
      this.transactionService.send('findAllTransactionByCustomerId', customerId)
    );

    return <BaseReponse>{
      status: HttpStatus.OK,
      message: 'success',
      data: response,
    };
  }
  @Get('byAccountNumber/:accountNumber')
  @Authorization(true)
  async GetAllByAccountNumber(
    // @Req() request: IAuthorizedRequest
    @Param('accountNumber') accountNumber: string
  ): Promise<BaseReponse> {
    // const customer = request.customer;
    console.log(accountNumber);

    const response: IServiceAccount = await firstValueFrom(
      this.transactionService.send(
        'findAllTransactionByAccountNumber',
        accountNumber
      )
    );

    return <BaseReponse>{
      status: HttpStatus.OK,
      message: 'success',
      data: response,
    };
  }
  @Get(':id')
  @Authorization(true)
  findOne(@Param('id') id: string) {
    return lastValueFrom(
      this.transactionService.send('findOneTransaction', id)
    );
  }

  @Patch(':id')
  @Authorization(true)
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    updateTransactionDto.id = id;
    return lastValueFrom(
      this.transactionService.send('updateTransaction', updateTransactionDto)
    );
  }

  @Delete(':id')
  @Authorization(true)
  remove(@Param('id') id: string) {
    return lastValueFrom(this.transactionService.send('deleteTransaction', id));
  }
}
