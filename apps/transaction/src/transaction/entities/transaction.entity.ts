import mongoose, { ObjectId } from 'mongoose';

export interface ITransactonSchema extends mongoose.Document {
  accountId: ObjectId;
  amount: number;
  type: string;
  transTime: Date;
  tellerEmpployeeId: string;
}
export const TransactionSchema = new mongoose.Schema<ITransactonSchema>(
  {
    accountId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    type: String,
    transTime: Date,
    tellerEmpployeeId: String,
  },
  { timestamps: true }
);
