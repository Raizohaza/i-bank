import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose, { Model, PipelineStage, Types } from 'mongoose';
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
    mongoose.isValidObjectId;
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

    return await this.model.find(query, { sort: { updateAt: -1 } }).lean();
  }
  async findAllByAggregate(findAllDTO: FindAllDTO) {
    const query: any = { $and: [] };
    if (findAllDTO.bank) query.bank = findAllDTO.bank;

    if (findAllDTO.from)
      query.$and.push({
        updatedAt: {
          $gte: new Date(new Date(findAllDTO.from).setHours(0, 0, 0, 0)),
        },
      });

    if (findAllDTO.to)
      query.$and.push({
        updatedAt: {
          $lte: new Date(new Date(findAllDTO.to).setHours(23, 59, 59, 999)),
        },
      });
    if (!query.$and.length) delete query.$and;
    console.log({
      query: query.$and,
      $lte: query.$and[0],
      $gte: query.$and[1],
    });

    return await this.model.aggregate([
      { $match: query },
      ...this.generateLookup(),
    ]);
  }
  generateLookup(): PipelineStage[] {
    return [
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $lookup: {
          from: 'Accounts',
          let: {
            fromAccount: '$fromAccount',
            toAccount: '$toAccount',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $eq: ['$_id', '$$fromAccount'],
                    },
                    {
                      $eq: ['$_id', '$$toAccount'],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                fromAccountNumber: '$accountNumber',
                toAccountNumber: '$accountNumber',
              },
            },
          ],
          as: 'Accounts',
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                $arrayElemAt: ['$Accounts', 0],
              },
              '$$ROOT',
            ],
          },
        },
      },
      {
        $project: {
          Accounts: 0,
        },
      },
    ];
  }
  async findAllByCustomerId(id) {
    const allAccount = await lastValueFrom(
      this.accountService.send('account_get_by_user_id', id)
    );
    console.log(allAccount, id);
    const accounts = allAccount.data.map(
      (account) => new Types.ObjectId(account.id)
    );
    console.log(accounts);
    const query = {
      $or: [
        { fromAccount: { $in: accounts } },
        { toAccount: { $in: accounts } },
      ],
    };
    console.log(query);

    const data = await this.model.aggregate([
      {
        $match: query, //{ customerId: new Types.ObjectId(id) },
      },
      ...this.generateLookup(),
    ]);

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
