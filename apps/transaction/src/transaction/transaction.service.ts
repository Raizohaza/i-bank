import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ITransaction } from './transaction.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { FindAllDTO } from './dto/find-all.dto';
@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private readonly model: Model<ITransaction>,
    @Inject('ACCOUNT_SERVICE') private readonly accountService: ClientProxy
  ) {}
  async findByAccountNumber(accountNumber: string) {
    return await lastValueFrom(
      this.accountService.send('findByAccountNumber', accountNumber)
    );
  }
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
    return await newTrans;
  }

  async setBalance({ id, code }: { id: string; code: string }) {
    const transaction = await this.findOne(id);
    if (code !== transaction.OTPToken.toString())
      throw new UnauthorizedException('Invalid Code');
    if (transaction.OTPVerify)
      throw new UnauthorizedException('Already update balance');
    await this.update(id, { OTPVerify: true, id: id });
    const setBalance = await lastValueFrom(
      this.accountService.send('setBalance', {
        fromAccount: transaction.fromAccount,
        toAccount: transaction.toAccount,
        amount: transaction.amount,
      })
    );
    return setBalance;
  }
  async setBalanceAbine({ id, code }: { id: string; code: string }) {
    const transaction = await this.findOne(id);
    if (code !== transaction.OTPToken.toString())
      throw new UnauthorizedException('Invalid Code');
    if (transaction.OTPVerify)
      throw new UnauthorizedException('Already update balance');
    await this.update(id, { OTPVerify: true, id: id });
    const setBalance = await lastValueFrom(
      this.accountService.send('setBalanceAbine', {
        fromAccount: transaction.fromAccount,
        toAccount: transaction.toAccount,
        amount: transaction.amount,
      })
    );
    return setBalance;
  }

  async createAbine(createTransactionDto: CreateTransactionDto) {
    createTransactionDto.bank = 'Abine';
    const newTrans = await this.model.create(createTransactionDto);
    return await newTrans;
  }
  async findAll(findAllDTO: FindAllDTO) {
    console.log({ findAllDTO });
    const query: any = { $and: [] };
    if (findAllDTO.bank) query.bank = findAllDTO.bank;

    if (findAllDTO.from)
      query.$and.push({ updatedAt: { $gte: findAllDTO.from } });

    if (findAllDTO.to) query.$and.push({ updatedAt: { $lte: findAllDTO.to } });
    if (!query.$and.length) delete query.$and;

    return await this.model.find(query).lean();
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
    const data = await this.model.findOne({ _id: id });
    console.log(data);
    return data;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    console.log(updateTransactionDto);
    return await this.model.findOneAndUpdate({ _id: id }, updateTransactionDto);
  }

  remove(id: string) {
    return `This action removes a #${id} transaction`;
  }
}
