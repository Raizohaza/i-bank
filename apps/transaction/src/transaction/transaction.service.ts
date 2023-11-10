import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ITransaction } from './transaction.interface';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private readonly model: Model<ITransaction>
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const newTrans = new this.model(createTransactionDto);
    return await newTrans.save();
  }

  findAll() {
    return `This action returns all transaction`;
  }
  async findAllByCustomerId(id) {
    const data = await this.model.find({ customerId: id }).lean();
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
