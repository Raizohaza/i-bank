import mongoose, { ObjectId } from 'mongoose';
function transformValue(doc, ret: { [key: string]: unknown }) {
  delete ret._id;
  delete ret.password;
}

export interface IAccountSchema extends mongoose.Document {
  customerId: ObjectId;
  type: string;
  balance: number;
  openDate: Date;
}

export class Account {}

export const AccountSchema = new mongoose.Schema<IAccountSchema>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    type: String,
    balance: Number,
    openDate: Date,
  },
  {
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
  }
);
