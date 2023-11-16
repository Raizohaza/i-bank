import { ObjectId } from 'mongoose';
import { ITransactonSchema } from '../entities/transaction.entity';

export class CreateTransactionAbineDto implements ITransactonSchema {
  customerId: ObjectId;
  fromAccount: ObjectId;
  fromName?: string;
  toAccount: ObjectId;
  toName?: string;
  fromAccountNumber?: string;
  toAccountNumber?: string;
  tellerEmpployeeId: string;
  //details
  amount: number;
  type: string;
  // transTime: Date;
  fee: number;
  contentTransaction: string;
  registerDay: Date;
  //token
  OTPToken: string;
  OTPVerify: boolean;
  bank: string;
  status: string;
}
