import mongoose from 'mongoose';

export class CreateTransactionDto {
  customerId: string;
  fromAccount: mongoose.Schema.Types.ObjectId;
  fromName?: string;
  toAccount: mongoose.Schema.Types.ObjectId;
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
  bank?: string;
  sign?: string;
  status?: string;
}
