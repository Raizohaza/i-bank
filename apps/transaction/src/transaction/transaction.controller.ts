import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FindAllDTO } from './dto/find-all.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('createTransactionByAccountNumber')
  async createByAccountNumber(
    @Payload() createTransactionDto: CreateTransactionDto
  ) {
    const fromAccount = await this.transactionService.findByAccountNumber(
      createTransactionDto.fromAccountNumber
    );

    const toAccount = await this.transactionService.findByAccountNumber(
      createTransactionDto.toAccountNumber
    );
    if (fromAccount) createTransactionDto.fromAccount = fromAccount._id;
    if (toAccount) createTransactionDto.toAccount = toAccount._id;
    const validateTrans = await this.transactionService.validateTransaction(
      createTransactionDto
    );
    if (validateTrans.validated)
      return await this.transactionService.create(createTransactionDto);
    throw new BadRequestException(
      `Validation failed: ${validateTrans.message}`
    );
  }
  @MessagePattern('createTransaction')
  async create(@Payload() createTransactionDto: CreateTransactionDto) {
    const validateTrans = await this.transactionService.validateTransaction(
      createTransactionDto
    );
    if (validateTrans.validated)
      return await this.transactionService.create(createTransactionDto);
    throw new BadRequestException(
      `Validation failed: ${validateTrans.message}`
    );
  }

  @MessagePattern('createTransactionAbine')
  async createAbine(@Payload() createTransactionDto: CreateTransactionDto) {
    const fromAccount = await this.transactionService.findByAccountNumber(
      createTransactionDto.fromAccountNumber
    );
    if (fromAccount) createTransactionDto.fromAccount = fromAccount._id;
    const validateTrans = await this.transactionService.validateTransaction(
      createTransactionDto
    );
    if (validateTrans.validated)
      return await this.transactionService.createAbine(createTransactionDto);
    throw new BadRequestException(
      `Validation failed: ${validateTrans.message}`
    );
  }

  @MessagePattern('createTransactionAbineOut')
  async createAbineOut(@Payload() createTransactionDto: CreateTransactionDto) {
    const fromAccount = await this.transactionService.findByAccountNumber(
      createTransactionDto.fromAccountNumber
    );
    if (fromAccount) createTransactionDto.fromAccount = fromAccount._id;
    const validateTrans = await this.transactionService.validateTransaction(
      createTransactionDto
    );
    delete createTransactionDto.toAccount;
    if (validateTrans.validated)
      return await this.transactionService.createAbine(createTransactionDto);
    throw new BadRequestException(
      `Validation failed: ${validateTrans.message}`
    );
  }

  @MessagePattern('findAllTransaction')
  findAll(findAllDTO: FindAllDTO) {
    console.log(findAllDTO);

    return this.transactionService.findAllByAggregate(findAllDTO);
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
  @MessagePattern('setBalance')
  setBalance(@Payload() data: { id: string; code: string }) {
    return this.transactionService.setBalance(data);
  }
  @MessagePattern('setBalanceAbine')
  setBalanceAbine(@Payload() data: { id: string; code: string }) {
    return this.transactionService.setBalanceAbine(data);
  }
}
