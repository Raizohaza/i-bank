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
  create(@Body() createTransactionDto: CreateTransactionDto) {
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
  @Get('byCustomerId')
  @Authorization(true)
  async GetAllByCustomerId(
    @Req() request: IAuthorizedRequest
  ): Promise<BaseReponse> {
    const customer = request.customer;
    const response: IServiceAccount = await firstValueFrom(
      this.transactionService.send(
        'findAllTransactionByCustomerId',
        customer.id
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
