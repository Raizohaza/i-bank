import mongoose, { ObjectId } from 'mongoose';

export interface ITransactonSchema {
  //basic info
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
  sign?: string;
  status: string;
}
export const TransactionSchema = new mongoose.Schema<
  ITransactonSchema & mongoose.Document
>(
  {
    amount: Number,
    type: String,
    // transTime: Date,
    tellerEmpployeeId: String,
    customerId: mongoose.Schema.Types.ObjectId,
    fromAccount: mongoose.Schema.Types.ObjectId,
    fromName: String,
    toAccount: mongoose.Schema.Types.ObjectId,
    toName: String,
    fromAccountNumber: String,
    toAccountNumber: String,
    OTPToken: String,
    OTPVerify: Boolean,
    fee: Number,
    contentTransaction: String,
    registerDay: Date,
    bank: {
      type: String,
      default: 'iBank',
    },
    sign: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: 'Success',
    },
  },
  { timestamps: true }
);
