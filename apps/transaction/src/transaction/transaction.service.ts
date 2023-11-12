import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ITransaction } from './transaction.interface';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private readonly model: Model<ITransaction>,
    @Inject('ACCOUNT_SERVICE') private readonly accountService: ClientProxy
  ) {}
  async validateTransaction(createTransactionDto: CreateTransactionDto) {
    const checkBalance = await lastValueFrom(
      this.accountService.send('checkBalance', {
        acountId: createTransactionDto.fromAccount,
        amount: createTransactionDto.amount,
      })
    );
    if (!checkBalance)
      return {
        validated: false,
        message: 'Not enough balance remain',
      };
    return {
      validated: true,
      message: 'Success',
    };
  }
  async create(createTransactionDto: CreateTransactionDto) {
    const newTrans = await this.model.create(createTransactionDto);
    const setBalance = await lastValueFrom(
      this.accountService.send('setBalance', {
        fromAccount: createTransactionDto.fromAccount,
        toAccount: createTransactionDto.toAccount,
        amount: createTransactionDto.amount,
      })
    );
    console.log(setBalance);

    return await newTrans;
  }
  async createAbine(createTransactionDto: CreateTransactionDto) {
    const keys = JSON.parse(JSON.stringify(createTransactionDto));
    console.log(keys);
    const newTrans = await this.model.create(createTransactionDto);
    console.log(newTrans);

    return await newTrans;
  }
  async findAll() {
    return await this.model.find({}).lean();
  }
  async findAllByCustomerId(id) {
    const data = await this.model.find({ customerId: id }).lean();
    console.log(data);
    return data;
  }
  async findAllTransactionByAccountNumber(accountNumber) {
    const data = await this.model
      .find({
        $or: [{ fromAccount: accountNumber }, { toAccount: accountNumber }],
      })
      .lean();
    console.log(data);
    return data;
  }
  async findOne(id: string) {
    const data = await this.model.find({ _id: id }).lean();
    console.log(data);
    return data;
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    console.log(updateTransactionDto);
    return `This action updates a #${id} transaction`;
  }

  remove(id: string) {
    return `This action removes a #${id} transaction`;
  }
}
