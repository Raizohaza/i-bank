import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { CreateReceiverDto } from './dto/create-receiver.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';
import { IReceiver } from './receivers.interface';
@Injectable()
export class ReceiversService {
  constructor(
    @Inject('ACCOUNT_SERVICE') private readonly accountService: ClientProxy,
    @Inject('CUSTOMER_SERVICE') private readonly customerService: ClientProxy,
    @InjectModel('Receiver') private readonly receiverModel: Model<IReceiver>
  ) {}
  async create(createReceiverDto: CreateReceiverDto) {
    console.log(createReceiverDto);
    const result = await lastValueFrom(
      this.accountService.send('findOneAccount', createReceiverDto.accountId)
    );
    if (!createReceiverDto.remindName) {
      const data = await lastValueFrom(
        this.customerService.send('customer_get_by_id', result.customerId)
      );
      console.log(data);
      createReceiverDto.remindName = data.customer.name;
    }
    if (!result) {
      return { message: 'Account ID is not existed!' };
    }
    const newReceiver = new this.receiverModel(createReceiverDto);
    return await newReceiver.save();
  }

  async findAll() {
    // return await this.receiverModel.find();
    return await this.receiverModel.aggregate([
      {
        $lookup: {
          from: 'Accounts',
          localField: 'accountId',
          foreignField: '_id',
          as: 'accounts',
        },
      },
      {
        $unwind: {
          path: '$accounts',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          remindName: 1,
          accountId: 1,
          accountNumber: '$accounts.accountNumber',
        },
      },
    ]);
  }

  async findAllByCustomerId(id: string) {
    // return await this.receiverModel.find();
    return await this.receiverModel.aggregate([
      {
        $match: {
          customerId: id,
        },
      },
      {
        $lookup: {
          from: 'Accounts',
          localField: 'accountId',
          foreignField: '_id',
          as: 'accounts',
        },
      },
      {
        $unwind: {
          path: '$accounts',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          remindName: 1,
          accountId: 1,
          accountNumber: '$accounts.accountNumber',
        },
      },
    ]);
  }

  async findOne(id: string) {
    console.log(id);
    return await this.receiverModel.findById(id);
  }

  async update(id: number, updateReceiverDto: UpdateReceiverDto) {
    console.log(updateReceiverDto);
    return await this.receiverModel.findByIdAndUpdate(
      updateReceiverDto.id,
      updateReceiverDto
    );
  }

  async remove(id: string) {
    console.log(id);
    return await this.receiverModel.deleteOne({ _id: id });
  }
}
