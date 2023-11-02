import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy
  ) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return lastValueFrom(
      this.transactionService.send('createTransaction', createTransactionDto)
    );
  }

  @Get()
  findAll() {
    return lastValueFrom(
      this.transactionService.send('findAllTransaction', {})
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return lastValueFrom(
      this.transactionService.send('findOneTransaction', id)
    );
  }

  @Patch(':id')
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
  remove(@Param('id') id: string) {
    return lastValueFrom(this.transactionService.send('deleteTransaction', id));
  }
}
