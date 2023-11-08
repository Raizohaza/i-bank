import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IAccount } from './interfaces/account.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<IAccount>
  ) {}
  async create(createAccountDto: CreateAccountDto) {
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

  async remove(id: string) {
    return await this.accountModel.deleteOne({ _id: id });
  }
}
