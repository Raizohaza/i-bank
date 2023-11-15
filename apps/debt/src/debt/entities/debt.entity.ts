import mongoose, { ObjectId } from 'mongoose';

export interface IDebtSchema extends mongoose.Document {
  //basic info
  customerId: ObjectId;
  creditor: string;
  debtor: string;
  //details
  amount: number;
  type: string;
  contentDebt: string;
  cancelReason?: string;
  //token
  OTPToken: string;
  OTPVerify: boolean;
  status: string;
  creditorId: string;
  debtorId: string;
}
export const DebtSchema = new mongoose.Schema<IDebtSchema>(
  {
    amount: Number,
    type: String,
    customerId: mongoose.Schema.Types.ObjectId,
    debtor: String,
    creditor: String,
    creditorId: String,
    debtorId: String,
    OTPToken: String,
    OTPVerify: Boolean,
    contentDebt: String,
    cancelReason: String,
    status: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
  },
  { timestamps: true }
);
