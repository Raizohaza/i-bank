import mongoose, { ObjectId } from 'mongoose';

export interface ITransactonSchema extends mongoose.Document {
  //basic info
  customerId: ObjectId;
  fromAccount: string;
  fromName?: string;
  toAccount: string;
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
  bank: string;
  sign?: string;
  status: string;
}
export const TransactionSchema = new mongoose.Schema<ITransactonSchema>(
  {
    amount: Number,
    type: String,
    // transTime: Date,
    tellerEmpployeeId: String,
    customerId: mongoose.Schema.Types.ObjectId,
    fromAccount: String,
    fromName: String,
    toAccount: String,
    toName: String,
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
