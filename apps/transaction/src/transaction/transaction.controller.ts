import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('createTransaction')
  async create(@Payload() createTransactionDto: CreateTransactionDto) {
    const validateTrans = await this.transactionService.validateTransaction(
      createTransactionDto
    );
    if (validateTrans)
      return await this.transactionService.create(createTransactionDto);
    throw new BadRequestException(
      `Validation failed: ${validateTrans.message}`
    );
  }

  @MessagePattern('createTransactionAbine')
  async createAbine(@Payload() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.createAbine(createTransactionDto);
  }

  @MessagePattern('findAllTransaction')
  findAll() {
    return this.transactionService.findAll();
  }

  @MessagePattern('findAllTransactionByCustomerId')
  findAllByCustomerId(@Payload() id: string) {
    return this.transactionService.findAllByCustomerId(id);
  }

  @MessagePattern('findAllTransactionByAccountNumber')
  findAllTransactionByAccountNumber(@Payload() id: string) {
    return this.transactionService.findAllTransactionByAccountNumber(id);
  }

  @MessagePattern('findOneTransaction')
  findOne(@Payload() id: string) {
    return this.transactionService.findOne(id);
  }

  @MessagePattern('updateTransaction')
  update(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(
      updateTransactionDto.id,
      updateTransactionDto
    );
  }

  @MessagePattern('removeTransaction')
  remove(@Payload() id: string) {
    return this.transactionService.remove(id);
  }
}
