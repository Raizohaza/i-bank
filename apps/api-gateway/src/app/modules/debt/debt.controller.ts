import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  BadRequestException,
  HttpStatus,
  Req,
  Sse,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { interval, lastValueFrom, map, Observable, Subject } from 'rxjs';
import { ICustomer } from '../customer';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import * as SendGrid from '@sendgrid/mail';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../decorators/authorization.decorator';
import { CancelDebtDto } from './dto/cancel-debt.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { BaseReponse } from '../../interfaces/common/base-reponse.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
@ApiBearerAuth()
@ApiTags('debt')
@Controller('debt')
export class DebtController {
  constructor(
    @Inject('ACCOUNT_SERVICE')
    private readonly accountService: ClientProxy,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy,
    @Inject('DEBT_SERVICE')
    private readonly debtService: ClientProxy,
    private readonly eventService: EventEmitter2,
    @Inject('MAILER_SERVICE') private readonly mailerService
  ) {}

  @Sse('sse/:id')
  sse(
    @Param() id //SseQueryDto
  ): Observable<any> {
    const subject$ = new Subject();
    this.eventService.on('debt', (data) => {
      // console.log(data);
      data.customerId = id;
      // if (sseQuery.email !== data.email) return;
      subject$.next(data);
    });
    return subject$.pipe(map((data) => ({ data })));
  }

  @Get('exampleEmit')
  exampleEmit() {
    this.eventService.emit('debt', {
      orderId: 1,
      payload: {},
    });
  }
  @Post()
  @Authorization(true)
  async createByAccountNumber(
    @Body() createDebtDto: CreateDebtDto,
    @Req() req
  ) {
    const customer: ICustomer = req.customer;
    console.log(createDebtDto);

    if (!createDebtDto.customerId) {
      createDebtDto.customerId = customer.id;
    }
    const creditorId = await lastValueFrom(
      this.accountService.send('findByAccountNumber', createDebtDto.creditor)
    ).catch((e) => {
      throw new BadRequestException(
        `Account number ${createDebtDto.creditor} invalid!`
      );
    });
    const debtorId = await lastValueFrom(
      this.accountService.send('findByAccountNumber', createDebtDto.debtor)
    ).catch((e) => {
      throw new BadRequestException(
        `Account number ${createDebtDto.debtor} invalid!`
      );
    });

    createDebtDto.creditorId = creditorId._id;
    createDebtDto.debtorId = debtorId._id;

    console.log(createDebtDto);

    const newDebt = await lastValueFrom(
      this.debtService.send('createDebt', createDebtDto)
    );
    //notify
    return newDebt;
  }

  @Patch('payDebt/:id')
  @Authorization(true)
  async payDebt(@Req() req, @Param('id') id: string) {
    const customer: ICustomer = req.customer;

    const toPayDebt: UpdateDebtDto = await lastValueFrom(
      this.debtService.send('findOneDebt', id)
    );
    console.log(toPayDebt);

    const newAutoTransaction = new CreateTransactionDto();
    newAutoTransaction.fromAccount = toPayDebt.creditorId;
    newAutoTransaction.toAccount = toPayDebt.debtorId;
    newAutoTransaction.amount = toPayDebt.amount;
    newAutoTransaction.contentTransaction = '';

    const newTrans = await this.createAutoTransaction(
      newAutoTransaction,
      req,
      toPayDebt.id
    );

    return newTrans;
  }
  async createAutoTransaction(
    createTransactionDto: CreateTransactionDto,
    req,
    debtId: string
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
      this.transactionService.send('createTransaction', createTransactionDto)
    )
      .then(async (respone) => {
        const payDebt = await lastValueFrom(
          this.debtService.send('updateDebt', { id: debtId, status: 'paid' })
        );
        console.log(payDebt);

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
    const sgTemplate = 'd-e12e8d5e02074d79b04502f2aa32e7fd';
    const mail: SendGrid.MailDataRequired = {
      to: customer.email,
      subject: 'OTP trancational pay debt confirmation',
      from: 'laptrinhweb100@gmail.com',
      dynamicTemplateData: {
        email: 'laptrinhweb100@gmail.com',
        headerText: 'confirm your pay debt',
        code: createTransactionDto.OTPToken,
      },
      templateId: sgTemplate,
    };
    console.log(mail);

    return await this.mailerService.send(mail);
  }
  @Patch('updateBalance/:transId')
  @Authorization(true)
  updateBalance(
    @Param('transId') id: string,
    @Body() updateBalanceDto: UpdateBalanceDto
  ) {
    updateBalanceDto.id = id;
    return lastValueFrom(
      this.transactionService.send('setBalance', updateBalanceDto)
    ).catch((e) => {
      throw new BadRequestException('Already update balance');
    });
  }

  @Get('findAll')
  @Authorization(true)
  async findAll() {
    return await lastValueFrom(this.debtService.send('findAllDebt', {}));
  }

  @Get()
  @Authorization(true)
  async findAllByLogin(@Req() req) {
    const customer: ICustomer = req.customer;
    const allAccount = await lastValueFrom(
      this.accountService.send('account_get_by_user_id', customer.id)
    );
    console.log(allAccount);

    const accounts = allAccount.data.map((account) => account.id);
    console.log({ allAccount, accounts });
    return await lastValueFrom(
      this.debtService.send('findAllDebtByLogin', accounts)
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await lastValueFrom(this.debtService.send('findOneDebt', id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    updateDebtDto.id = id;
    return await lastValueFrom(
      this.debtService.send('updateDebt', updateDebtDto)
    );
  }
  @Patch('cancelRemindDebt/:id')
  @Authorization(true)
  async cancelRemindDebt(
    @Body() updateDebtDto: CancelDebtDto,
    @Req() req,
    @Param() id: string
  ) {
    updateDebtDto.id = id;
    if (!updateDebtDto.cancelReason)
      throw new BadRequestException('Cancel reason should be not empty!');

    updateDebtDto.status = 'canceled';
    return await lastValueFrom(
      this.debtService.send('updateDebt', updateDebtDto)
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await lastValueFrom(this.debtService.send('removeDebt', id));
  }
}
