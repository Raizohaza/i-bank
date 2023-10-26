import mongoose, { ObjectId } from 'mongoose';

export interface ITransactonSchema extends mongoose.Document {
  account_id: ObjectId;
  amount: number;
  type: string;
  teller_emp_id: string;
}
export const TransactionSchema = new mongoose.Schema<ITransactonSchema>({
  account_id: mongoose.Schema.Types.ObjectId,
  amount: Number,
  type: String,
  teller_emp_id: String,
});
