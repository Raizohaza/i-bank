import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IAccount } from './interfaces/account.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<IAccount>
  ) {}
  async create(createAccountDto: CreateAccountDto) {
    if (createAccountDto.type === 'PAYROLL') {
      const existingAccount = await this.accountModel.findOne({
        customerId: createAccountDto.customerId,
        type: 'PAYROLL',
      });

      if (existingAccount) {
        return {
          errors: [`Customer already has a PAYROLL account.`],
          message: `Customer already has a PAYROLL account.`,
        };
      }
    }
    const newAccount = new this.accountModel(createAccountDto);
    return await newAccount.save();
  }

  async findAll() {
    return await this.accountModel.find();
  }

  async remoteFindById(id: string) {
    return await this.accountModel.findById(id).select('_id balance');
  }

  async remoteFindByAccountNumber(accountNum: string) {
    const data = await this.accountModel.aggregate([
      { $match: { accountNumber: accountNum } },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customers',
        },
      },
      {
        $unwind: {
          path: '$customers',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          email: '$customers.email',
          name: '$customers.name',
          accountNumber: 1,
        },
      },
    ]);
    console.log(data);
    return data;
  }
  async findByAccountNumber(accountNum: string) {
    console.log(accountNum);
    const data = await this.accountModel.aggregate([
      { $match: { accountNumber: accountNum } },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customers',
        },
      },
      {
        $unwind: {
          path: '$customers',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          email: '$customers.email',
          name: '$customers.name',
          accountNumber: 1,
          type: 1,
          customerId: '$customers._id',
        },
      },
    ]);
    console.log(data);
    return data[0];
  }
  async findOne(id: string) {
    return await this.accountModel.findById(id);
  }
  async findByUser(userId: string) {
    return await this.accountModel.find({ customerId: userId });
  }
  async update(id: string, updateAccountDto: UpdateAccountDto) {
    console.log(updateAccountDto);
    return await this.accountModel.findOneAndUpdate(
      { _id: updateAccountDto.id },
      updateAccountDto
    );
  }
  async updateStatus(id: string, status: string) {
    return await this.accountModel.findOneAndUpdate(
      { _id: id },
      { status: status }
    );
  }
  async remove(id: string) {
    return await this.accountModel.deleteOne({ _id: id });
  }

  async checkBalance(acountId: string, amount: number) {
    const account = await this.accountModel.findOne({ _id: acountId });
    console.log({ amount, account });

    if (account?.balance < amount) return false;
    return true;
  }

  async setBalance(data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
  }) {
    const fromAccount = await this.accountModel.findOne({
      _id: data.fromAccount,
    });
    const toAccount = await this.accountModel.findOne({ _id: data.toAccount });

    fromAccount.balance -= data.amount;
    toAccount.balance += data.amount;
    console.log({ data, fromAccount, toAccount });

    const result = await Promise.all([
      this.accountModel.findOneAndUpdate(
        { _id: data.fromAccount },
        { balance: fromAccount.balance },
        { new: true }
      ),
      this.accountModel.findOneAndUpdate(
        { _id: data.toAccount },
        { balance: toAccount.balance },
        { new: true }
      ),
    ]);
    console.log(result);

    return result;
  }
  async setBalanceAbine(data: {
    fromAccount: string;
    toAccount: string;
    amount: number;
  }) {
    if (mongoose.isValidObjectId(data.fromAccount)) {
      const fromAccount = await this.accountModel.findOne({
        _id: data.fromAccount,
      });

      fromAccount.balance -= data.amount;
      return await this.accountModel.findOneAndUpdate(
        { _id: data.fromAccount },
        { balance: fromAccount.balance }
      );
    }

    if (mongoose.isValidObjectId(data.toAccount)) {
      const toAccount = await this.accountModel.findOne({
        _id: data.toAccount,
      });
      toAccount.balance += data.amount;
      return await this.accountModel.findOneAndUpdate(
        { _id: data.toAccount },
        { balance: toAccount.balance }
      );
    }

    return false;
  }
}
