import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IAccount } from './interfaces/account.interface';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<IAccount>
  ) {}
  async create(createAccountDto: IAccount) {
    const newAccount = new this.accountModel(createAccountDto);
    return await newAccount.save();
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
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
