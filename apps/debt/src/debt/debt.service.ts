import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDebtDto } from './dto/create-debt.dto';
import { IDebt } from './dto/IDebt';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Injectable()
export class DebtService {
  constructor(
    @InjectModel('Debt') private readonly model: Model<IDebt>,
    @Inject('ACCOUNT_SERVICE') private readonly accountService: ClientProxy,
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionService: ClientProxy
  ) {}
  async create(createDebtDto: CreateDebtDto) {
    console.log(createDebtDto);
    return await this.model.create(createDebtDto);
  }

  async findAll() {
    return await this.model.find();
  }

  async findOne(id: string) {
    return await this.model.findOne({ _id: id });
  }

  async update(id: string, updateDebtDto: UpdateDebtDto) {
    console.log({ updateDebtDto, id });
    return await this.model.findOneAndUpdate({ _id: id }, updateDebtDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.model.deleteOne({ _id: id });
  }

  async findAllDebtByLogin(accounts: string[]) {
    console.log(accounts);
    return await this.model.find({
      $or: [
        {
          creditorId: { $in: accounts },
        },
        {
          debtorId: { $in: accounts },
        },
      ],
    });
  }
}
