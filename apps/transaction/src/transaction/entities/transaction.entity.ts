import mongoose, { ObjectId } from 'mongoose';

export interface ITransactonSchema extends mongoose.Document {
  //basic info
  customerId: ObjectId;
  fromAccount: ObjectId;
  fromName?: string;
  toAccount: ObjectId;
  toName?: string;
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
}
export const TransactionSchema = new mongoose.Schema<ITransactonSchema>(
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
    OTPToken: String,
    OTPVerify: Boolean,
    fee: Number,
    contentTransaction: String,
    registerDay: Date,
  },
  { timestamps: true }
);
