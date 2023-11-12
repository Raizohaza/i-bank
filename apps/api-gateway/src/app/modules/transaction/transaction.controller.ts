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
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Authorization } from '../../decorators/authorization.decorator';
import { IAuthorizedRequest } from '../../interfaces/common/authorized-request.interface';
import { IServiceAccount } from '../account/service-account.interface';
import { BaseReponse } from '../../interfaces/common/base-reponse.dto';
import { HttpStatus } from '@nestjs/common/enums';
import { Request } from 'express';
import { ICustomer } from '../customer';
@ApiBearerAuth()
@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy,
    @Inject('ACCOUNT_SERVICE')
    private readonly accountService: ClientProxy
  ) {}

  @Post()
  @Authorization(true)
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    const customer: ICustomer = req.customer;
    if (!createTransactionDto.customerId) {
      createTransactionDto.customerId = customer.id;
    }
    if (!createTransactionDto.fromName)
      createTransactionDto.fromName = customer.name;
    console.log({ customer, createTransactionDto });
    // return true;
    return lastValueFrom(
      this.transactionService.send('createTransaction', createTransactionDto)
    ).then((respone) => {
      return <BaseReponse>{
        status: HttpStatus.CREATED,
        message: 'success',
        data: respone,
      };
    });
  }

  @Get()
  @Authorization(true)
  findAll() {
    return lastValueFrom(
      this.transactionService.send('findAllTransaction', {})
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
